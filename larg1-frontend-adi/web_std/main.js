import Api from "../js/utils/api.js"

var handlebars = require('handlebars')

const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiYWRtaW4iLCJpYXQiOjE1MDg4OTIwMTgsImV4cCI6MTU0MDQyODAxOH0.EtajOb9-Tc5rrS8Ct3nOdvo61QEZJH_v1sjDgG9OmC4"


var templatePhoto = `<p>
    <span id="{{id}}">
        <strong>{{title}}</strong>
    </span>   
    <a id="enlace_detalles_{{id}}" href="javascript:verDetalles({{id}})">Detalles</a>
    <a id="enlace_editar_{{id}}" href="javascript:verEditar({{id}})">Editar</a>
    <a id="enlace_eliminar_{{id}}" href="javascript:eliminar({{id}})">Eliminar</a>
</p>`

var templateListaPhotos = `<h2>Lista de fotos del usuario admin</h2>
{{#.}}
    ${templatePhoto}
{{/.}}`

var templateDetallesPhoto = `<p id="detalles_{{id}}">
    <img src="{{detalles}}" style="width:50%;height:50%" 
        onError="if(this.src.indexOf('css/media/not_found.png') === -1) this.src='../css/media/not_found.png';">
    </img>
</p>`

var templateEditarPhoto = `<form id="editar_{{id}}">
    <p></p>
    <label>Titulo:</label> <input id="edit_title" type="text" value="{{title}}" style="width:80%"/><br/>
    <label>Url:</label> <input id="edit_url" type="text" value="{{url}}" style="width:80%"/><br/>
</form>`

var tmpl_photo_compilada = handlebars.compile(templatePhoto)
var tmpl_lista_photos_compilada = handlebars.compile(templateListaPhotos)
var tmpl_detalles_photo_compilada = handlebars.compile(templateDetallesPhoto)
var tmpl_editar_photo_compilada = handlebars.compile(templateEditarPhoto)


document.addEventListener('DOMContentLoaded', function(){
	console.log("Página cargada!: " +  new Date().toLocaleString())
	getPhotos()
})

function getPhotos(){
    new Api().getPhotos(token, 1).then(function (result) {
        if (result && result[0] && result[0][0] && result[0][0].id) {
            var photos = []
            for (var i = 0; i < result.length - 1; i++) { //resto 1 para quitar el hipermedia
                photos.push(result[i][0])
            }
            var listaHTML = tmpl_lista_photos_compilada(photos)
            document.getElementById("miComponente").innerHTML = listaHTML
        } else if (result && result.message && result.message=="No tienes fotos") {
            var html = `<h2>Lista de fotos del usuario admin</h2><p>`+ result.message + `</p>`
            document.getElementById("miComponente").innerHTML = html
        } else if (result && result.error) {
            var html = `<h2>Lista de fotos del usuario admin</h2><p>`+ result.error + `</p>`
            document.getElementById("miComponente").innerHTML = html
        } else {
            var html = `<h2>Lista de fotos del usuario admin</h2><p>Error desconocido</p>`
            document.getElementById("miComponente").innerHTML = html
        }
    })
}

document.getElementById('boton_create_photo').addEventListener('click', function(){
    var nuevo = {title:document.getElementById('nuevo_titulo').value,
                 src:document.getElementById('nuevo_url').value}

    new Api().createPhoto(token, 1, nuevo).then(function(result){
        console.log(result)
        if(result && result[0] && result[0].id){
            var nuevoHTML = tmpl_photo_compilada(result[0])
            document.getElementById('miComponente').insertAdjacentHTML('beforeend', nuevoHTML)
        }
    })
})

function verDetalles(idPhoto) {
	new Api().getPhoto(token, 1, idPhoto).then(function(result){
        console.log(result)
        if(result && result[0] && result[0].id){
            var datos = {id: result[0].id, detalles: result[0].url}
            var datosHTML = tmpl_detalles_photo_compilada(datos)

            var divItem = document.getElementById(idPhoto)
            divItem.insertAdjacentHTML('beforeend', datosHTML)

            var enlaceDetalles = document.getElementById('enlace_detalles_'+idPhoto)
            enlaceDetalles.href = 'javascript:ocultarDetalles('+ idPhoto +')'
            enlaceDetalles.innerHTML = 'Ocultar detalles'

            document.getElementById('enlace_editar_'+idPhoto).style.display = 'none'
            document.getElementById('enlace_eliminar_'+idPhoto).style.display = 'none'
        }
	})
}
window.verDetalles = verDetalles

function ocultarDetalles(idPhoto) {
	document.getElementById('detalles_'+idPhoto).outerHTML = ''

	document.getElementById('enlace_detalles_'+idPhoto).href = 'javascript:verDetalles('+idPhoto+')'
    document.getElementById('enlace_detalles_'+idPhoto).innerHTML = 'Detalles'
    
    document.getElementById('enlace_editar_'+idPhoto).style.display = 'unset'
    document.getElementById('enlace_eliminar_'+idPhoto).style.display = 'unset'    
}
window.ocultarDetalles = ocultarDetalles

function verEditar(idPhoto) {
    new Api().getPhoto(token, 1, idPhoto).then(function(result){
        console.log(result)
        if(result && result[0] && result[0].id){
            var datos = {id:result[0].id, title: result[0].title, url: result[0].url}
            var datosHTML = tmpl_editar_photo_compilada(datos)

            var divItem = document.getElementById(idPhoto)
            divItem.insertAdjacentHTML('beforeend', datosHTML)

            var enlaceDetalles = document.getElementById('enlace_editar_'+idPhoto)
            enlaceDetalles.href = 'javascript:ocultarEditar('+ idPhoto +')'
            enlaceDetalles.innerHTML = 'Editar'

            document.getElementById('enlace_detalles_'+idPhoto).style.display = 'none'
            document.getElementById('enlace_eliminar_'+idPhoto).style.display = 'none'            
        }
	})
}
window.verEditar = verEditar

function ocultarEditar(idPhoto) {
    var photo = {idPhoto:idPhoto, 
        src:document.getElementById('edit_url').value, 
        title:document.getElementById('edit_title').value}
    new Api().editPhoto(token, 1, photo).then(function(result){
        console.log(result)
        if(result && result[0] && result[0].id){
            getPhotos()
        }
    })
}
window.ocultarEditar = ocultarEditar

function eliminar(idPhoto) {
    new Api().deletePhoto(token, 1, idPhoto).then(function(result){
        console.log(result)
        if(result && result.message && result.message=="Borrado correctamente"){
            getPhotos()
        }
    })
}
window.eliminar = eliminar