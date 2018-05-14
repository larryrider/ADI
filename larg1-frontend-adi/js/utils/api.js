class API {
    constructor() {
        this.HOST_URL = 'http://localhost:3000'
        this.LOGIN_URL = this.HOST_URL + '/login'
        this.LOGIN_OAUTH_URL = this.HOST_URL + '/login/oauth'
        this.USERS_URL = this.HOST_URL + '/users'
        this.PHOTOS_URL = '/photos'
    }

    login(usuario) {
        return fetch(this.LOGIN_URL, {
            method: 'POST',
            headers: {
                'Content-type':'application/json'
            },
            body: JSON.stringify(usuario)
        }).then(function (respuesta) {
            return respuesta.json()
        })
    }

    loginOAuth(googleToken){
        return fetch(this.LOGIN_OAUTH_URL, {
            method: 'POST',
            headers: {
                'Content-type':'application/json'
            },
            body: JSON.stringify(googleToken)
        }).then(function (respuesta) {
            return respuesta.json()
        })
    }

    register(usuario){
        return fetch(this.USERS_URL, {
            method: 'POST',
            headers: {
                'Content-type':'application/json'
            },
            body: JSON.stringify(usuario)
        }).then(function (respuesta) {
            return respuesta.json()
        })
    }

    getPhotos(token, idUsuario){
        return fetch(this.USERS_URL + '/' + idUsuario + this.PHOTOS_URL, {
            method: 'GET',
            headers: {
                'Content-type':'application/json',
                'Authorization':token
            }
        }).then(function (respuesta) {
            if(respuesta.status == 204){
                return {"message": "No tienes fotos"}
            } else{
                return respuesta.json()
            }
        })
    }

    editPhoto(token, idUsuario, photo){
        return fetch(this.USERS_URL + '/' + idUsuario + this.PHOTOS_URL + '/' + photo.idPhoto, {
            method: 'PUT',
            headers: {
                'Content-type':'application/json',
                'Authorization':token
            },
            body: JSON.stringify({url:photo.src, title:photo.title})
        }).then(function (respuesta) {
            return respuesta.json()
        })
    }

    deletePhoto(token, idUsuario, idPhoto){
        return fetch(this.USERS_URL + '/' + idUsuario + this.PHOTOS_URL + '/' + idPhoto, {
            method: 'DELETE',
            headers: {
                'Content-type':'application/json',
                'Authorization':token
            }
        }).then(function (respuesta) {
            if(respuesta.status == 204){
                return {"message": "Borrado correctamente"}
            } else{
                return respuesta.json()
            }
        })
    }

    createPhoto(token, idUsuario, photo){
        return fetch(this.USERS_URL + '/' + idUsuario + this.PHOTOS_URL, {
            method: 'POST',
            headers: {
                'Content-type':'application/json',
                'Authorization':token
            },
            body: JSON.stringify({url:photo.src, title:photo.title})
        }).then(function (respuesta) {
            return respuesta.json()
        })
    }

    getUser(token, idUsuario){
        return fetch(this.USERS_URL + '/' + idUsuario, {
            method: 'GET',
            headers: {
                'Content-type':'application/json',
                'Authorization':token
            }
        }).then(function (respuesta) {
            return respuesta.json()
        })
    }

    editUser(token, user){
        return fetch(this.USERS_URL + '/' + user.id, {
            method: 'PUT',
            headers: {
                'Content-type':'application/json',
                'Authorization':token
            },
            body: JSON.stringify({username:user.username, password:user.password})
        }).then(function (respuesta) {
            return respuesta.json()
        })
    }

    getPhoto(token, idUsuario, idPhoto){
        return fetch(this.USERS_URL + '/' + idUsuario + this.PHOTOS_URL + "/" + idPhoto, {
            method: 'GET',
            headers: {
                'Content-type':'application/json',
                'Authorization':token
            }
        }).then(function (respuesta) {
            return respuesta.json()
        })
    }
}

export default API