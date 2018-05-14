import React from 'react'
import Api from "./utils/api.js"
import '../css/login.css'


class Auth extends React.Component{
    constructor(props){
        super(props)
        this.state = {doingLogin : true}

        this.clickLoginOAuth = this.clickLoginOAuth.bind(this)
        this.clickRegister = this.clickRegister.bind(this)
        this.clickLogin = this.clickLogin.bind(this)
        this.handleLoginOK = this.handleLoginOK.bind(this)
    }

    handleLoginOK(){
        this.props.handleLoginOK();
    }

    clickLoginOAuth(){
        var props = this.props
        var OAUTHURL =   'https://accounts.google.com/o/oauth2/auth?'
        var SCOPE    =   'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
        var CLIENTID =   '****' //credenciales de google
        var REDIRECT =   'http://localhost:8080/response.html' //response
        var TYPE     =   'token';
        var _url     =   OAUTHURL + 'scope=' + SCOPE + '&client_id=' + CLIENTID + '&redirect_uri=' + REDIRECT + '&response_type=' + TYPE
        var acToken

        var win       =   window.open(_url, "windowname1", 'width=800, height=600')
        
        var pollTimer =   window.setInterval(function() { 
            try {
                //console.log(win.document.URL);
                if(!win || !win.document || !win.document.URL){
                    window.clearInterval(pollTimer)
                }
                if (win.document.URL.indexOf(REDIRECT) != -1) {
                    window.clearInterval(pollTimer)
                    var url =   win.document.URL
                    acToken =   gup(url, 'access_token')
                    var tokenType = gup(url, 'token_type')
                    var expiresIn = gup(url, 'expires_in')
                    win.close()
                    //console.log(acToken)
                    const googleToken = {
                        googleToken : acToken
                    }
                    new Api().loginOAuth(googleToken).then(function(result){
                        console.log(result)
                        if(result && result[0] && result[0].token){
                            document.getElementById('error').innerHTML = ""
                            localStorage.setItem('token', result[0].token)
                            localStorage.setItem('login', JSON.stringify({id:result[0].id,username:result[0].username}))
                            props.handleLoginOK()
                        } else if(result && result.error){
                            document.getElementById('error').innerHTML = result.error
                            localStorage.removeItem('token')
                            localStorage.removeItem('login')
                        } else{
                            document.getElementById('error').innerHTML = "Error desconocido"
                            localStorage.removeItem('token')
                            localStorage.removeItem('login')
                        }
                    })
                }
            } catch(e) {
                //console.log(e)
            }
        }, 500)
        
    }

    clickRegister(){
        this.setState({doingLogin : false})
    }

    clickLogin(){
        this.setState({doingLogin : true})
    }

    render(){
        if(this.state.doingLogin){
            var form = <Login handleLoginOK={this.handleLoginOK}/>
        } else{
            form = <Register handleRegister={this.clickLogin}/>
        }

        return <div className="container">
            <p></p>
            <center><img src="../css/media/instarom2.png" className="img-login" alt="Instarom"></img></center>
            <div className="omb_login">
                <div className="row omb_row-sm-offset-3">
                    <div className="col-xs-12 col-sm-6">
                        {this.state.doingLogin ? 
                            <h3 className="centered-text">Haz login o <a onClick={this.clickRegister} href="#">Regístrate aquí</a></h3> :
                            <h3 className="centered-text">Regístrate o <a onClick={this.clickLogin} href="#">Haz login aquí</a></h3>
                        }
                    </div>
                </div>
                <br></br>
                <div className="row omb_row-sm-offset-3 omb_socialButtons">
                    <div className="col-xs-12 col-sm-6">
                        <a onClick={this.clickLoginOAuth} href="#" className="btn btn-lg btn-block omb_btn-google">
                            <span className="visible-xs"><i className="fa fa-google-plus"></i>
                                {this.state.doingLogin ? ' Login' : ' Regístrate'}</span>
                            <span className="hidden-xs"><i className="fa fa-google-plus"></i>
                                {this.state.doingLogin ? ' Login' : ' Regístrate'} con Google</span>
                        </a>
                    </div>
                </div>
                <div className="row omb_row-sm-offset-3 omb_loginOr">
                    <div className="col-xs-12 col-sm-6">
                        <hr className="omb_hrOr"></hr>
                        <span className="omb_spanOr"></span>
                    </div>
                </div>
                <div className="row omb_row-sm-offset-3">
                    <div className="col-xs-12 col-sm-6">
                        {form}
                    </div>
                </div>
            </div>
        </div>
    }

}

class Login extends React.Component{
    constructor(props){
        super(props)

        this.state = {username : '', password : ''}
        this.handleUser = this.handleUser.bind(this)
        this.handlePass = this.handlePass.bind(this)

        this.clickLogin = this.clickLogin.bind(this)
    }

    handleUser(user) {
        this.setState({username: user.target.value})
        document.getElementById('error').innerHTML = ""
    }

    handlePass(pass) {
        this.setState({password: pass.target.value})
        document.getElementById('error').innerHTML = ""
    }

    clickLogin(event){
        event.preventDefault()
        var props = this.props
        const usuario = {
            username : this.state.username,
            password : this.state.password
        }
        new Api().login(usuario).then(function(result){
            console.log(result)
            if(result && result[0] && result[0].token){
                document.getElementById('error').innerHTML = ""
                localStorage.setItem('token', result[0].token)
                localStorage.setItem('login', JSON.stringify({id:result[0].id,username:result[0].username}))
                props.handleLoginOK()
            } else if(result && result.error){
                document.getElementById('error').innerHTML = result.error
                localStorage.removeItem('token')
                localStorage.removeItem('login')
            } else{
                document.getElementById('error').innerHTML = "Error desconocido"
                localStorage.removeItem('token')
                localStorage.removeItem('login')
            }
        }).catch(function(){
            document.getElementById('error').innerHTML = "Error de conexion con la api (¿Está en funcionamiento?)"
        })
    }

    render(){
        return <form className="omb_loginForm" action="" onSubmit={this.clickLogin}>
            <div className="input-group">
                <span className="input-group-addon"><i className="fa fa-user"></i></span>
                <input type="text" value={this.state.username} onChange={this.handleUser} className="form-control" placeholder="Introduzca su usuario" maxLength="30" autoComplete="on" required autoFocus/>
            </div>
            <span className="help-block"></span>
            <div className="input-group">
                <span className="input-group-addon"><i className="fa fa-lock"></i></span>
                <input type="password" value={this.state.password} onChange={this.handlePass} className="form-control" placeholder="Introduzca su contraseña" maxLength="30" autoComplete="on" required/>
            </div>
            <span id="error" className="help-block"></span>
            <button className="btn btn-lg btn-primary btn-block" type="submit"><i className="fa fa-sign-in"></i> Login</button>
        </form>
    }
}

class Register extends React.Component{
    constructor(props){
        super(props)

        this.state = {username : '', password : '', password2 : ''}
        this.handleUser = this.handleUser.bind(this)
        this.handlePass = this.handlePass.bind(this)
        this.handlePass2 = this.handlePass2.bind(this)
        this.clickRegister = this.clickRegister.bind(this)
    }

    handleUser(user) {
        this.setState({username: user.target.value})
    }

    handlePass(pass) {
        this.setState({password: pass.target.value})
        if(pass.target.value != this.state.password2){
            document.getElementById('error').innerHTML = "Las contraseñas no coinciden"
        } else{
            document.getElementById('error').innerHTML = ""
        }
    }

    handlePass2(pass2) {
        this.setState({password2: pass2.target.value})
        if(pass2.target.value != this.state.password){
            document.getElementById('error').innerHTML = "Las contraseñas no coinciden"
        } else{
            document.getElementById('error').innerHTML = ""
        }
    }

    clickRegister(event){
        event.preventDefault()
        if(this.state.password == this.state.password2){
            var props = this.props;
            const usuario = {
                username : this.state.username,
                password : this.state.password
            }
            new Api().register(usuario).then(function(result){
                console.log(result)
                if(result && result[0] && result[0].id){
                    document.getElementById('error').innerHTML = ""
                    alert("Has sido registrado correctamente")
                    props.handleRegister()
                } else if(result && result[0] && result[0].error){
                    if(result[0].error == "Problema con la base de datos")
                        document.getElementById('error').innerHTML = "Ese usuario ya existe"
                    else{
                        document.getElementById('error').innerHTML = result[0].error
                    }
                } else{
                    document.getElementById('error').innerHTML = "Error desconocido"
                }
            }).catch(function(){
                document.getElementById('error').innerHTML = "Error de conexion con la api (¿Está en funcionamiento?)"
            })
        } else{
            alert("Las contraseñas no coinciden")
        }
    }

    render(){
        return <form className="omb_loginForm" action="" onSubmit={this.clickRegister}>
            <div className="input-group">
                <span className="input-group-addon"><i className="fa fa-user"></i></span>
                <input type="text" value={this.state.username} onChange={this.handleUser} className="form-control" placeholder="Introduzca un nuevo usuario" maxLength="30" autoComplete="off" required autoFocus/>
            </div>
            <span className="help-block"></span>
            <div className="input-group">
                <span className="input-group-addon"><i className="fa fa-lock"></i></span>
                <input type="password" value={this.state.password} onChange={this.handlePass} className="form-control" placeholder="Introduzca una contraseña" maxLength="30" autoComplete="off" required/>
            </div>
            <span className="help-block"></span>
            <div className="input-group">
                <span className="input-group-addon"><i className="fa fa-lock"></i></span>
                <input type="password" value={this.state.password2} onChange={this.handlePass2} className="form-control" placeholder="Confirme la contraseña" maxLength="30" autoComplete="off" required/>
            </div>
            <span id="error" className="help-block"></span>
            <button className="btn btn-lg btn-success btn-block visible-xs" type="submit"><i className="fa fa-plus-circle"></i> Registrar</button>
            <button className="btn btn-lg btn-success btn-block hidden-xs" type="submit"><i className="fa fa-plus-circle"></i> Registrar nuevo usuario</button>
        </form>
    }
}

function gup(url, name) {
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\#&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    if( results == null )
        return "";
    else
        return results[1];
}


//Exportamos el componente. Usamos el "default"
//porque no necesitamos exportar varias cosas separadas
export default Auth