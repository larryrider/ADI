const database = require('./database')


exports.showUsers = function(req, res) {  // Mostrar todos los usuarios
    database.getUsers(res, function(rows) {
        if(rows != null) {
            var array = new Array()
            for(var i in rows) {
                var arrayAux = new Array()
                arrayAux.push(rows[i])
                var links = {
                    "_links" : {
                        "self" : {
                            "href" : (('http://' + req.headers.host) || '') + '/users/' 
                                        + rows[i].id
                        },
                        "photos" : {
                            "href" : (('http://' + req.headers.host) || '') + '/users/' 
                                        + rows[i].id + '/photos'
                        }
                    }
                }
                arrayAux.push(links)
                array.push(arrayAux)
            }
            var links = {
                "_links" : {
                    "self" : {
                        "href" : (('http://' + req.headers.host) || '') + '/users'
                    }
                }
            }
            array.push(links)
            res.status(200)
            res.send(array)
        } else{
            res.status(204)
            res.send({'message':'No hay usuarios registrados'})
        }
    })
}

exports.showUser = function(req, res) {  // Mostrar un usuario en concreto
    var idUsuario = req.params.id
    database.getUser(res, idUsuario, function(row) {
        if(row != null) {
            var array = new Array()
            array.push(row)
            var links = {
                "_links" : {
                    "self" : {
                        "href" : (('http://' + req.headers.host) || '') + '/users/' + idUsuario
                    },
                    "photos" : {
                        "href" : (('http://' + req.headers.host) || '') + '/users/' + idUsuario + '/photos'
                    }
                }
            }
            array.push(links)
            res.status(200)
            res.send(array)
        }else{
            res.status(404)
            res.send({'error':'Este usuario no existe'})
        }
    })
}

exports.createUser = function(req, res) {  // Crear un usuario
    var username = req.body.username
    var password = req.body.password
    if(username && password){
        database.insertOnUsers(res, username, password, function(){
            database.getUserId(res, username, function(id){
                if(id != null){
                    var array = new Array()
                    array.push({'id':id, 'username':username, 'password':password})
                    var links = {
                        "_links" : {
                            "self" : {
                                "href" : (('http://' + req.headers.host) || '') + '/users/' + id
                            },
                            "photos" : {
                                "href" : (('http://' + req.headers.host) || '') + '/users/' + id + '/photos'
                            }
                        }
                    }
                    array.push(links)
                    res.status(201)
                    res.send(array)
                } else{
                    res.status(500)
                    res.send({'error':'Ha ocurrido un problema al crear usuario'})
                }
            })
        })
    } else{
        var errorUsername = (!username) ? '(El parámetro username no ha sido establecido)' : ''
        var errorPassword = (!password) ? ' (El parámetro password no ha sido establecido)' : ''
        res.status(400)
        res.send({'error':'Error al crear el usuario' + errorUsername + errorPassword})
    }
}

exports.editUser = function(req, res) {  // Editar un usuario
    var idUser = req.params.id
    var username = req.body.username
    var password = req.body.password
    if(username && password){
        database.getUser(res, idUser, function(rows) {
            if(rows != null){
                database.editUser(res, idUser, username, password, function(){
                    var array = new Array()
                    array.push({'id':idUser, 'username':username, 'password':password})
                    var links = {
                        "_links" : {
                            "self" : {
                                "href" : (('http://' + req.headers.host) || '') + '/users/' + idUser
                            },
                            "photos" : {
                                "href" : (('http://' + req.headers.host) || '') + '/users/' 
                                            + idUser + '/photos'
                            }
                        }
                    }
                    array.push(links)
                    res.status(200)
                    res.send(array)
                })
            } else{
                res.status(404)
                res.send({'error':'Este usuario no existe'})
            }
        })
    } else{
        var errorUsername = (!username) ? ' (El parámetro username no ha sido establecido)' : ''
        var errorPassword = (!password) ? ' (El parámetro password no ha sido establecido)' : ''
        res.status(400)
        res.send({'error':'Error al editar el usuario' + errorUsername + errorPassword})
    }
}

exports.deleteUser = function(req, res) {  // Eliminar un usuario
    var idUser = req.params.id
    database.getUser(res, idUser, function(user){
        if(user != null){
            database.deleteUser(res, idUser, function(){
                res.status(204)
                res.send({'message':'Usuario borrado con éxito'})
            })
        } else{
            res.status(404)
            res.send({'error':'Este usuario no existe'})
        }
    })
}
