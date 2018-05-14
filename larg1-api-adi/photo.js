const database = require('./database')


exports.showPhotos = function(req, res) {  // Mostrar todas las fotos de un usuario
    var id = req.params.id
    database.getUser(res, id, function(row) {
        if(row != null) {
            database.getUserPhotos(res, id, function(rows) {
                if(rows != null) {
                    var array = new Array()
                    for(var i in rows) {
                        var arrayAux = new Array()
                        arrayAux.push(rows[i])
                        var links = {
                            "_links" : {
                                "self" : {
                                    "href" : (('http://' + req.headers.host) || '') + '/users/' 
                                                + rows[i].idUser + '/photos/' + rows[i].id 
                                }
                            }
                        }
                        arrayAux.push(links)
                        array.push(arrayAux)
                    }
                    var links = {
                        "_links" : {
                            "self" : {
                                "href" : (('http://' + req.headers.host) || '') + '/users/' 
                                            + id + '/photos' 
                            },
                            "user" : {
                                "href" : (('http://' + req.headers.host) || '') + '/users/' + id
                            }
                        }
                    }
                    array.push(links)
                    res.status(200)
                    res.send(array)
                } else{
                    res.status(204)
                    res.send({'message':'Este usuario no tiene fotos'})
                }
            })
        } else{
            res.status(404)
            res.send({'error':'Este usuario no existe'})
        }
    })
}

exports.showPhoto = function(req, res) {  // Mostrar una foto de un usuario
    var idUser = req.params.id
    var idPhoto = req.params.idPhoto
    database.getUser(res, idUser, function(row) {
        if(row != null){
            database.getPhoto(res, idUser, idPhoto, function(row) {
                if(row != null) {
                    var array = new Array()
                    array.push(row)
                    var links = {
                        "_links" : {
                            "self" : {
                                "href" : (('http://' + req.headers.host) || '') + '/users/' 
                                            + idUser + '/photos/' + idPhoto
                            },
                            "photos" : {
                                "href" : (('http://' + req.headers.host) || '') + '/users/' 
                                            + idUser + '/photos'
                            },
                            "user" : {
                                "href" : (('http://' + req.headers.host) || '') + '/users/' 
                                            + idUser
                            }
                        }
                    }
                    array.push(links)
                    res.status(200)
                    res.send(array)
                } else{
                    res.status(404)
                    res.send({'error':'Foto no encontrada'})
                }
            })
        } else{
            res.status(404)
            res.send({'error':'Este usuario no existe'})
        }
    })
}

exports.createPhoto = function(req, res) {  // Crear una foto
    var idUser = req.params.id
    var url = req.body.url
    var title = req.body.title
    if(url && title){
        database.getUser(res, idUser, function(row) {
            if(row != null){
                database.insertOnPhotos(res, idUser, url, title, function(){
                    database.getLastIdPhoto(res, idUser, function(idPhoto){
                        if(idPhoto != null){
                            var array = new Array()
                            array.push({'id':idPhoto, 'idUser':idUser, 'url':url, 'title':title})
                            var links = {
                                "_links" : {
                                    "self" : {
                                        "href" : (('http://' + req.headers.host) || '') + '/users/' 
                                                    + idUser + '/photos/' + idPhoto
                                    },
                                    "photos" : {
                                        "href" : (('http://' + req.headers.host) || '') + '/users/' 
                                                    + idUser + '/photos'
                                    },
                                    "user" : {
                                        "href" : (('http://' + req.headers.host) || '') + '/users/' 
                                                    + idUser
                                    }
                                }
                            }
                            array.push(links)
                            res.status(201)
                            res.send(array)
                        } else{
                            res.status(500)
                            res.send({'error':'Ha habido un problema al subir la foto'})
                        }
                    })
                })
            } else{
                res.status(404)
                res.send({'error':'Este usuario no existe'})
            }
        })
    } else{
        var errorUrl = (!url) ? '(El parámetro url no ha sido establecido)' : ''
        var errorTitle = (!title) ? ' (El parámetro title no ha sido establecido)' : ''
        res.status(400)
        res.send({'error':'Error al crear la foto ' + errorUrl + errorTitle})
    }
}

exports.editPhoto = function(req, res) {  // Editar una foto
    var idUser = req.params.id
    var idPhoto = req.params.idPhoto
    var url = req.body.url
    var title = req.body.title
    if(url && title){
        database.getUser(res, idUser, function(row) {
            if(row != null){
                database.getPhoto(res, idUser, idPhoto, function(rows) {
                    if(rows != null) {
                        database.editPhoto(res, idPhoto, url, title, function(){
                            var array = new Array()
                            array.push({'id':idPhoto, 'idUser':idUser, 'url':url, 'title':title})
                            var links = {
                                "_links" : {
                                    "self" : {
                                        "href" : (('http://' + req.headers.host) || '') + '/users/' 
                                                    + idUser + '/photos/' + idPhoto
                                    },
                                    "photos" : {
                                        "href" : (('http://' + req.headers.host) || '') + '/users/' 
                                                    + idUser + '/photos'
                                    },
                                    "user" : {
                                        "href" : (('http://' + req.headers.host) || '') + '/users/' 
                                                    + idUser
                                    }
                                }
                            }
                            array.push(links)
                            res.status(200)
                            res.send(array)
                        })
                    } else{
                        res.status(404)
                        res.send({'error':'Foto no encontrada'})
                    }
                })
            } else{
                res.status(404)
                res.send({'error':'Este usuario no existe'})
            }
        })
    } else{
        var errorUrl = (!url) ? ' (El parámetro url no ha sido establecido)' : ''
        var errorTitle = (!title) ? ' (El parámetro title no ha sido establecido)' : ''
        res.status(400)
        res.send({'error':'Error al editar la foto' + errorUrl + errorTitle})
    }
}

exports.deletePhoto = function(req, res) {  // Eliminar una foto
    var idUser = req.params.id
    var idPhoto = req.params.idPhoto
    database.getUser(res, idUser, function(rows) {
        if(rows != null) {
            database.getPhoto(res, idUser, idPhoto, function(row) {
                if(row != null) {
                    database.deletePhoto(res, idPhoto, function(){
                        res.status(204)
                        res.send({'message':'Foto borrada con éxito'})
                    })
                } else{
                    res.status(404)
                    res.send({'error':'Foto no encontrada'})
                }
            })
        } else{
            res.status(404)
            res.send({'error':'Este usuario no existe'})
        }
    })
}