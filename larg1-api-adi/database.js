const mysql = require('mysql')

const db_config = { //si necesitas las credenciales contacta conmigo
  database : '*-*-*-',
  host     : '//////',
  user     : '-----',
  password : '*****' 
}
exports.db_config = db_config
var mysqlPool = mysql.createPool(db_config); 


exports.getUsers = function(res, callback){ //Devuelve todos los usuarios
  mysqlPool.getConnection(function(err, db) {
    if(!err){
      db.query('SELECT id, username FROM users', function(err, rows) {
        if(!err){
          if(rows.length>0){
            callback(rows)
          } else{
            callback(null)
          }
        } else{
            console.log(err.message)
            res.status(500)
            res.send({'error':'Problema con la base de datos'})
        }
        db.release()
      })
    } else{
      console.log(err.message)
      res.status(500)
      res.send({'error':'Problema de conexión con la base de datos'})
    }
  })
}

exports.getUser = function(res, id, callback){ //Devuelve un usuario buscando por id
  mysqlPool.getConnection(function(err, db) {
    if(!err){
      db.query('SELECT id, username FROM users WHERE id=?', [id], function(err, rows) {
        if(!err){
          if(rows.length>0){
            callback(rows[0])
          } else{
            callback(null)
          }
        } else{
          console.log(err.message)
          res.status(500)
          res.send({'error':'Problema con la base de datos'})
        }
        db.release()
      })
    } else{
      console.log(err.message)
      res.status(500)
      res.send({'error':'Problema de conexión con la base de datos'})
    }
  })
}

exports.getUserId = function(res, username, callback){ //Devuelve la id de un usuario
  mysqlPool.getConnection(function(err, db) {
    if(!err){
      db.query('SELECT id FROM users WHERE username=?', [username], function(err, rows) {
        if(!err){
          if(rows.length>0){
            callback(rows[0].id)
          } else{
            callback(null)
          }
        } else{
          console.log(err.message)
          res.status(500)
          res.send({'error':'Problema con la base de datos'})
        }
        db.release()
      })
    } else{
      console.log(err.message)
      res.status(500)
      res.send({'error':'Problema de conexión con la base de datos'})
    }
  })
}

exports.getUser_username = function(res, username, callback){ //Busca un usuario por username
  mysqlPool.getConnection(function(err, db) {
    if(!err){
      db.query('SELECT * FROM users WHERE username=?', [username], function(err, rows) {
        if(!err){
          if(rows.length>0){
            callback(rows[0])
          } else{
            callback(null)
          }
        } else{
          console.log(err.message)
          res.status(500)
          res.send({'error':'Problema con la base de datos'})
        }
        db.release()
      })
    } else{
      console.log(err.message)
      res.status(500)
      res.send({'error':'Problema de conexión con la base de datos'})
    }
  })
}

exports.getUser_id = function(res, id, callback){ //Busca un usuario por id
  mysqlPool.getConnection(function(err, db) {
    if(!err){
      db.query('SELECT * FROM users WHERE id=?', [id], function(err, rows) {
        if(!err){
          if(rows.length>0){
            callback(rows[0])
          } else{
            callback(null)
          }
        } else{
          console.log(err.message)
          res.status(500)
          res.send({'error':'Problema con la base de datos'})
        }
        db.release()
      })
    } else{
      console.log(err.message)
      res.status(500)
      res.send({'error':'Problema de conexión con la base de datos'})
    }
  })
}

exports.insertOnUsers = function(res, username, password, callback){
  mysqlPool.getConnection(function(err, db) {
    if(!err){
      db.query('INSERT INTO users(username, password) VALUES(?, ?)', [username, password], function(err){
        if(!err){
          callback()
        } else{
          console.log(err.message)
          res.status(500)
          res.send([{'error':'Problema con la base de datos'}])
        }
        db.release()
      })
    } else{
      console.log(err.message)
      res.status(500)
      res.send({'error':'Problema de conexión con la base de datos'})
    }
  })
}

exports.editUser = function(res, idUser, username, password, callback){
  mysqlPool.getConnection(function(err, db) {
    if(!err){
      db.query('UPDATE users SET username=?, password=? WHERE id=?', [username, password, idUser], function(err) {
        if(!err){
          callback()
        } else{
          console.log(err.message)
          res.status(500)
          res.send({'error':'Problema con la base de datos'})
        }
        db.release()
      })
    } else{
      console.log(err.message)
      res.status(500)
      res.send({'error':'Problema de conexión con la base de datos'})
    }
  })
}

exports.deleteUser = function(res, idUser, callback){
  mysqlPool.getConnection(function(err, db) {
    if(!err){
      db.query('DELETE FROM users WHERE id = ?', [idUser], function(err) {
        if(!err){
          callback()
        } else{
          console.log(err.message)
          res.status(500)
          res.send({'error':'Problema con la base de datos'})
        }
        db.release()
      })
    } else{
      console.log(err.message)
      res.status(500)
      res.send({'error':'Problema de conexión con la base de datos'})
    }
  })
}

exports.getUserPhotos = function(res, id, callback){
  mysqlPool.getConnection(function(err, db) {
    if(!err){
      db.query('SELECT * FROM photos WHERE idUser=?', [id], function(err, rows) {
        if(!err){
          if(rows.length>0){
            callback(rows)
          } else{
            callback(null)
          }
        } else{
          console.log(err.message)
          res.status(500)
          res.send({'error':'Problema con la base de datos'})
        }
        db.release()
      })
    } else{
      console.log(err.message)
      res.status(500)
      res.send({'error':'Problema de conexión con la base de datos'})
    }
  })
}

exports.getPhoto = function(res, idUser, idPhoto, callback){
  mysqlPool.getConnection(function(err, db) {
    if(!err){
      db.query('SELECT * FROM photos WHERE idUser=? AND id=?', [idUser, idPhoto], function(err, rows) {
        if(!err){
          if(rows.length>0){
            callback(rows[0])
          } else{
            callback(null)
          }
        } else{
          console.log(err.message)
          res.status(500)
          res.send({'error':'Problema con la base de datos'})
        }
        db.release()
      })
    } else{
      console.log(err.message)
      res.status(500)
      res.send({'error':'Problema de conexión con la base de datos'})
    }
  })
}

exports.editPhoto = function(res, idPhoto, url, title, callback){
  mysqlPool.getConnection(function(err, db) {
    if(!err){
      db.query('UPDATE photos SET url=?, title=? WHERE id=?', [url, title, idPhoto], function(err) {
        if(!err){
          callback()
        } else{
          console.log(err.message)
          res.status(500)
          res.send({'error':'Problema con la base de datos'})
        }
        db.release()
      })
    } else{
      console.log(err.message)
      res.status(500)
      res.send({'error':'Problema de conexión con la base de datos'})
    }
  })
}

exports.insertOnPhotos = function(res, idUser, url, title, callback){
  mysqlPool.getConnection(function(err, db) {
    if(!err){
      db.query('INSERT INTO photos(idUser, url, title) VALUES(?, ?, ?)', [idUser, url, title], function(err) {
        if(!err){
          callback()
        } else{
          console.log(err.message)
          res.status(500)
          res.send({'error':'Problema con la base de datos'})
        }
        db.release()
      })
    } else{
      console.log(err.message)
      res.status(500)
      res.send({'error':'Problema de conexión con la base de datos'})
    }
  })
}

exports.getLastIdPhoto = function(res, idUSer, callback){
  mysqlPool.getConnection(function(err, db) {
    if(!err){
      db.query('SELECT MAX (id) id FROM photos WHERE idUser =?', [idUSer], function(err, rows){
        if(!err){
          if(rows.length>0){
            callback(rows[0].id)
          } else{
            callback(null)
          }
        } else{
          console.log(err.message)
          res.status(500)
          res.send({'error':'Problema con la base de datos'})
        }
        db.release()
      })
    } else{
      console.log(err.message)
      res.status(500)
      res.send({'error':'Problema de conexión con la base de datos'})
    }
  })
}

exports.deletePhoto = function(res, idPhoto, callback){
  mysqlPool.getConnection(function(err, db) {
    if(!err){
      db.query('DELETE FROM photos WHERE id = ?', [idPhoto], function(err) {
        if(!err){
          callback()
        } else{
          console.log(err.message)
          res.status(500)
          res.send({'error':'Problema con la base de datos'})
        }
        db.release()
      })
    } else{
      console.log(err.message)
      res.status(500)
      res.send({'error':'Problema de conexión con la base de datos'})
    }
  })
}