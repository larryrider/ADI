import React from 'react'
import Auth from './auth'
import Api from "./utils/api.js"
import { ShowPhoto, EditPhoto, DeletePhoto, CreatePhoto } from './photo'
import {ShowUser} from './user'
import '../css/home.css'

class Home extends React.Component {
    constructor() {
        super()

        var actions = { home: 'home', editPhoto: 'editPhoto', deletePhoto: 'deletePhoto', createPhoto: 'createPhoto', showUser: 'showUser' }
        
        if (localStorage.getItem('token')) {
            var login = JSON.parse(localStorage.getItem('login'))
            this.state = { logged: true, actions: actions, action: actions.home, objectAction: 'none', login: login }
        } else {
            this.state = { logged: false, actions: actions, action: actions.home, objectAction: 'none', login: '' }
        }

        this.loginOK = this.loginOK.bind(this)
        this.logoutOK = this.logoutOK.bind(this)
        this.editPhoto = this.editPhoto.bind(this)
        this.deletePhoto = this.deletePhoto.bind(this)
        this.createPhoto = this.createPhoto.bind(this)
        this.showUser = this.showUser.bind(this)
        this.changeLogin = this.changeLogin.bind(this)
    }

    loginOK() {
        var login = JSON.parse(localStorage.getItem('login'))
        this.setState({ logged: true, action: this.state.actions.home, objectAction: 'none', login: login})
    }

    logoutOK() {
        this.setState({ logged: false, action: this.state.actions.home, objectAction: 'none', login: '' })
        localStorage.removeItem('token')
        localStorage.removeItem('login')
    }

    editPhoto(photo) {
        if (photo) {
            this.setState({ action: this.state.actions.editPhoto, objectAction: photo })
        } else {
            this.setState({ action: this.state.actions.home, objectAction: 'none' })
        }
    }

    deletePhoto(photo) {
        if (photo) {
            this.setState({ action: this.state.actions.deletePhoto, objectAction: photo })
        } else {
            this.setState({ action: this.state.actions.home, objectAction: 'none' })
        }
    }

    createPhoto(create) {
        if (create) {
            this.setState({ action: this.state.actions.createPhoto, objectAction: create })
        } else {
            this.setState({ action: this.state.actions.home, objectAction: 'none' })
        }
    }

    showUser(user) {
        if (user) {
            this.setState({ action: this.state.actions.showUser, objectAction: user })
        } else {
            this.setState({ action: this.state.actions.home, objectAction: 'none' })
        }
    }

    changeLogin(login){
        this.setState({login:login})
    }

    componentDidMount() {
        if (this.state.logged) {
            try {
                var token = localStorage.getItem('token')
                var login = JSON.parse(localStorage.getItem('login'))
            } catch (e) {
                console.log(e)
                this.logoutOK()
            } finally {
                if (!token || !login || token == null || login == null) {
                    this.logoutOK()
                }
            }
        }
    }

    render() {
        if (!this.state.logged) {
            document.getElementById('body').style.backgroundSize = "cover"
            document.getElementById('body').style.backgroundImage = "url(../css/media/background_login.jpg)"

            return <Auth handleLoginOK={this.loginOK}/>
        } else {
            document.getElementById('body').style.backgroundSize = "cover"
            document.getElementById('body').style.backgroundImage = "url(../css/media/background_home.jpg"
            //document.getElementById('body').style.backgroundColor = "#fafafa"

            var login = this.state.login

            switch (this.state.action) {
                case (this.state.actions.editPhoto):
                    var style = { 'backgroundColor': 'coral' }
                    var title = <h4>Editar Foto</h4>
                    var panel = <EditPhoto photo={this.state.objectAction} editPhoto={this.editPhoto} handleLogoutOK={this.logoutOK} />
                    break
                case (this.state.actions.deletePhoto):
                    var style = { 'backgroundColor': 'indianred' }
                    var title = <h4>¿Eliminar foto?</h4>
                    var panel = <DeletePhoto photo={this.state.objectAction} deletePhoto={this.deletePhoto} handleLogoutOK={this.logoutOK} />
                    break
                case (this.state.actions.createPhoto):
                    var style = { 'backgroundColor': 'steelblue' }
                    var title = <h4>Crear Nueva Foto</h4>
                    var panel = <CreatePhoto createPhoto={this.createPhoto} handleLogoutOK={this.logoutOK} />
                    break
                case (this.state.actions.showUser):
                    var style = { 'backgroundColor': 'mediumaquamarine' }
                    var title = <h4>Mi perfil</h4>
                    var user = {id:login.id, username:login.username, countPhotos:$('.photo').length}
                    var panel = <ShowUser showUser={this.showUser} user={user} handleLogoutOK={this.logoutOK} changeLogin={this.changeLogin}/>
                    break
                case (this.state.actions.home):
                default:
                    var style = { 'backgroundColor': 'mediumpurple' }
                    var title = <h4>Fotos de {login.username}</h4>
                    var panel = <Gallery editPhoto={this.editPhoto} deletePhoto={this.deletePhoto} handleLogoutOK={this.logoutOK} />
            }

            return <div>
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="/"><img src="../css/media/instarom2.png" className="img-navbar" alt="Instarom"></img></a>
                            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                        </div>
                        <div className="collapse navbar-collapse" id="myNavbar">
                            <ul className="nav navbar-nav navbar-right">
                                <li>
                                    <a onClick={this.createPhoto} href="#"><span className="glyphicon glyphicon-cloud-upload"></span> Subir nueva foto</a>
                                </li>
                                <li className="dropdown"><a href="#" className="dropdown-toggle" data-toggle="dropdown">Bienvenido, {login.username} <b className="caret"></b></a>
                                    <ul id="dropDown" className="dropdown-menu">
                                        <li><a onClick={this.showUser} href="#"><i className="glyphicon glyphicon-user"></i> Mi perfil</a></li>
                                        <li className="divider"></li>
                                        <li><a onClick={this.logoutOK} href=""><i className="glyphicon glyphicon-log-out"></i> Cerrar sesión</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <section>
                    <div className="container gal-container">
                        <div className="panel panel-default">
                            <div id="panelHeading" className="panel-heading" style={style}>{title}</div>
                            <div className="panel-body">
                                {panel}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        }
    }
}

class Gallery extends React.Component {
    constructor(props) {
        super(props)
        this.state = { photos: [] }
    }

    componentDidMount() {
        try {
            var token = localStorage.getItem('token')
            var login = JSON.parse(localStorage.getItem('login'))
        } catch (e) {
            console.log(e)
            this.props.handleLogoutOK()
        } finally {
            if (!token || !login || token == null || login == null) {
                this.props.handleLogoutOK()
            }
        }
        try {
            var state = this
            new Api().getPhotos(token, login.id).then(function (result) {
                console.log(result)
                if (result && result[0] && result[0][0] && result[0][0].id) {
                    var photos = []
                    for (var i = 0; i < result.length - 1; i++) { //resto 1 para quitar el hipermedia
                        photos.push(result[i])
                    }
                    state.setState({ photos: photos })
                } else if (result && result.message && result.message=="No tienes fotos") {
                    state.setState({ photos: [] })
                    document.getElementById('errorPhotos').innerHTML = ""
                } else if (result && result.error) {
                    state.setState({ photos: [] })
                    document.getElementById('errorPhotos').innerHTML = result.error
                } else {
                    state.setState({ photos: [] })
                    document.getElementById('errorPhotos').innerHTML = "Error desconocido"
                }
            }).catch(function () {
                document.getElementById('errorPhotos').innerHTML = "Error de conexion con la api (¿Está en funcionamiento?)"
            })
        } catch (e) {
        }
    }

    render() {
        var photos = []
        if (this.state.photos.length > 0) {
            for (var i = 0; i < this.state.photos.length; i++) {
                photos.push(<ShowPhoto key={i}
                    idPhoto={this.state.photos[i][0].id}
                    src={this.state.photos[i][0].url}
                    title={this.state.photos[i][0].title}
                    editPhoto={this.props.editPhoto}
                    deletePhoto={this.props.deletePhoto} />)
            }
        } else {
            photos = <center><h3>No tienes fotos</h3>
                <p></p><h5 id="errorPhotos"></h5>
            </center>
        }
        return photos
    }
}

export default Home