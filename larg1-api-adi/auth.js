const jwt = require('jwt-simple')
const moment = require('moment')
const database = require('./database')

const secret='******'


exports.createToken = createToken = function(id, user, pass) {
    var payload = {
        id: id,
        username: user,
        password: pass,
        iat: moment().unix(),
        exp: moment().add(7, "days").unix(),
    }
    return jwt.encode(payload, secret)
}

exports.login = function(req, res) { // Login usando user/password
    var username = req.body.username
    var password = req.body.password
    if(username && password && password != ""){
        database.getUser_username(res, username, function(user){
            if(user != null){
                if(username != user.username){
                    res.status(401)
                    res.send({'error':'Credenciales incorrectas'})
                } else if(password != user.password){
                    res.status(401)
                    res.send({'error':'Credenciales incorrectas'})
                } else{
                    var array = new Array()
                    array.push({'id':user.id, 'username':username, 'token':createToken(user.id, username, user.password)})
                    var links = {
                        "_links" : {
                            "self" : {
                                "href" : (('http://' + req.headers.host) || '') + '/users/' + user.id
                            },
                            "photos" : {
                                "href" : (('http://' + req.headers.host) || '') + '/users/' + user.id + '/photos'
                            }
                        }
                    }
                    array.push(links)
                    res.status(200)
                    res.send(array)
                }
            } else{
                res.status(401)
                res.send({'error':'Credenciales incorrectas'})
            }
        })
    } else{
        var errorUsername = (!username) ? ' (El parámetro username no ha sido establecido)' : ''
        var errorPassword = (!password) ? ' (El parámetro password no ha sido establecido)' : ''
        res.status(400)
        res.send({'error':'Error en el login' + errorUsername + errorPassword})
    }
}

exports.loginWithGoogle = function(req, res) {  // Login con Google
    var googleToken = req.body.googleToken
    if(googleToken){
        checkGoogleToken(googleToken, function(response){ // Que el token de google sea correcto
            if(response != "error"){
                var username = response.email
                database.getUser_username(res, username, function(user) { //si la id no existe, se crea el usuario
                    if(user != null) {
                        var array = new Array()
                        array.push({'id':user.id, 'username':username, 'token':createToken(user.id, username, user.password), 
                                    'googleToken':googleToken})
                        var links = {
                            "_links" : {
                                "self" : {
                                    "href" : (('http://' + req.headers.host) || '') + '/users/' + user.id
                                },
                                "photos" : {
                                    "href" : (('http://' + req.headers.host) || '') + '/users/' + user.id + '/photos'
                                }
                            }
                        }
                        array.push(links)
                        res.status(200)
                        res.send(array)
                    } else{
                        database.insertOnUsers(res, username, "", function(){
                            database.getUser_username(res, username, function(user){
                                var array = new Array()
                                array.push({'id':user.id, 'username':username, 'token':createToken(user.id, username, user.password)})
                                var links = {
                                    "_links" : {
                                        "self" : {
                                            "href" : (('http://' + req.headers.host) || '') + '/users/' + user.id
                                        },
                                        "photos" : {
                                            "href" : (('http://' + req.headers.host) || '') + '/users/' + user.id + '/photos'
                                        }
                                    }
                                }
                                array.push(links)
                                res.status(200)
                                res.send(array)
                            })
                        })
                    }
                })
            } else{
                res.status(401)
                res.send({'error':'Error con el token de google'})
            }
        })
    } else{
        var errorgoogleToken = (!googleToken) ? '(El parámetro googleToken no ha sido establecido)' : ''
        res.status(400)
        res.send({'error':'Error al crear el usuario' + errorgoogleToken})
    }
}

checkGoogleToken = function(googleToken, callback){ // Comprueba si el token es correcto
    var request=require('request')
    var validURL = 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + googleToken
    request.get(validURL, function(err, res, body){
        if(!err){
            if(res.statusCode === 200 ){
                callback(eval("(" + body + ")"))
            } else{
                callback("error")
            }
        } else{
            callback("error")
        }
    })
}

exports.checkCompleteUser = function(req, res, next){ //Comprueba que el usuario logueado sea el mismo username y pass incluido 
                                                      //que realiza la peticion
    if(req.headers.authorization){
        var token = req.headers.authorization
        try{
            var decoded = jwt.decode(token, secret)
        } catch(e){
            res.status(401)
            res.send({'error':'Token incorrecto'})
        }
        if (decoded && decoded.id && decoded.username) {
            if(decoded.id != req.params.id){
                res.status(403)
                res.send({'error':'Este usuario no tiene permisos suficientes'})
            } else{
                if(decoded.exp <= moment.unix()){
                    res.status(401)
                    res.send({'error':'El token ha expirado'})
                } else{
                    database.getUser_id(res, decoded.id, function(user){
                        if(user == null){
                            res.status(401)
                            res.send({'error':'Hay un problema con tu usuario y el token(No existe)'})
                        } else if(user.username != decoded.username){
                            res.status(401)
                            res.send({'error':'Hay un problema con tu usuario y el token'})
                        } else if(user.password && decoded.password && user.password != decoded.password){
                            res.status(401)
                            res.send({'error':'Hay un problema con tu password y la del token'})
                        } else{
                            next()
                        }
                    })
                }
            }
        } else{
            res.status(401)
            res.send({'error':'El token está corrupto'})
        }
    } else{
        res.status(401)
        res.send({'error':'Sin cabeceras de autorizacion (Sin loguear)'})
    }
}

exports.checkIdUser = function(req, res, next){ //Comprueba que el id del usuario logueado sea el mismo 
    //que realiza la peticion
    if(req.headers.authorization){
        var token = req.headers.authorization
        try{
            var decoded = jwt.decode(token, secret)
        } catch(e){
            res.status(401)
            res.send({'error':'Token incorrecto'})
        }
        if (decoded && decoded.id && decoded.username) {
            if(decoded.id != req.params.id){
                res.status(403)
                res.send({'error':'Este usuario no tiene permisos suficientes'})
            } else{
                if(decoded.exp <= moment.unix()){
                    res.status(401)
                    res.send({'error':'El token ha expirado'})
                } else{
                    database.getUser(res, decoded.id, function(user){
                        if(user == null){
                            res.status(401)
                            res.send({'error':'Hay un problema con tu usuario'})
                        } else{
                            next()
                        }
                    })
                }
            }
        } else{
            res.status(401)
            res.send({'error':'El token está corrupto'})
        }
    } else{
        res.status(401)
        res.send({'error':'Sin cabeceras de autorizacion (Sin loguear)'})
    }
}

exports.checkLogged = function(req, res, next){ //Comprueba solo que el usuario este logueado 
    if(req.headers.authorization){
        var token = req.headers.authorization
        try{
            var decoded = jwt.decode(token, secret)
        } catch(e){
            res.status(401)
            res.send({'error':'El token está corrupto'})
        }
        if (decoded && decoded.id) {
            if(decoded.exp <= moment.unix()){
                res.status(401)
                res.send({'error':'El token ha expirado'})
            } else{
                database.getUser_id(res, decoded.id, function(user){
                    if(user == null){
                        res.status(401)
                        res.send({'error':'Hay un problema con tu usuario (No existe)'})
                    } else if(user.username != decoded.username){
                        res.status(401)
                        res.send({'error':'Hay un problema con tu usuario y el token'})
                    } else if(user.password && decoded.password && user.password != decoded.password){
                        res.status(401)
                        res.send({'error':'Hay un problema con tu password y la del token'})
                    } else{
                        next()
                    }
                })
            }
        }
    } else{
        res.status(401)
        res.send({'error':'Sin cabeceras de autorizacion (Sin loguear)'})
    }
}