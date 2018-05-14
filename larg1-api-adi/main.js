const express = require('express')
const bodyParser = require('body-parser')
const app = express()

// FICHEROS USADOS
const user = require('./user')
const photo = require('./photo')
const auth = require('./auth')
const cors = require('cors')
app.use(cors())

// INICIALIZAR RUTAS
const router = express.Router()
router.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false })) // Parse application/x-www-form-urlencoded
app.use(router)




// DEFINIR RUTAS
app.get('/users', auth.checkLogged, user.showUsers) //listar usuarios
app.post('/users', user.createUser) //crear usuario nuevo
app.get('/users/:id', auth.checkLogged, user.showUser) //mostrar usuario concreto
app.put('/users/:id', auth.checkIdUser, user.editUser) //editar usuario concreto
app.delete('/users/:id', auth.checkCompleteUser, user.deleteUser) //eliminar usuario concreto

app.get('/users/:id/photos', auth.checkLogged, photo.showPhotos) //listar fotos de un usuario
app.get('/users/:id/photos/:idPhoto', auth.checkLogged, photo.showPhoto) //mostrar foto de un usuario
app.post('/users/:id/photos', auth.checkCompleteUser, photo.createPhoto) //crear foto nueva
app.put('/users/:id/photos/:idPhoto', auth.checkCompleteUser, photo.editPhoto) //editar foto de un usuario
app.delete('/users/:id/photos/:idPhoto', auth.checkCompleteUser, photo.deletePhoto) //eliminar foto de un usuario

app.post('/login', auth.login) //login con user/password
app.post('/login/oauth', auth.loginWithGoogle) //crear un usuario a partir de su usuario unicamente
app.use('/login/oauth', express.static('web')) //pequeño cliente con dos botones para loguear usando oauth
app.get('/login/oauth/response', function(req, res){ //pagina "en blanco" necesaria para el login usando oauth
    res.status(200)
    res.send('Logueado correctamente!')
}) 



app.listen(process.env.PORT || 3000, function() {
    console.log('Servidor express iniciado!')
})

module.exports = app