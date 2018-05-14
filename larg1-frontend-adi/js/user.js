import React from 'react'
import Api from "./utils/api.js"

class ShowUser extends React.Component{
    constructor(props){
        super(props)

        var fecha= new Date(Date.now()).toLocaleString()
        var user = {id:this.props.user.id, username:this.props.user.username, countPhotos: this.props.user.countPhotos}
        this.state = {fecha:fecha, user: user, editUser: false}
        this.goHome = this.goHome.bind(this)
        this.fecha = this.fecha.bind(this)
        this.showEdit = this.showEdit.bind(this)
        this.edit = this.edit.bind(this)
    }

    goHome(){
        this.props.showUser(false)
    }

    fecha(){
        if(this._ismounted){
            this.setState({fecha: new Date(Date.now()).toLocaleString()})
        }
    }

    showEdit(show){
        document.getElementById('error').innerHTML = ""
        this.setState({editUser: show})
    }

    edit(){
        var username = document.getElementById("username").getAttribute("value")
        var password = document.getElementById("password").getAttribute("value")
        var password2 = document.getElementById("password2").getAttribute("value")
        if(!username || username == "" || !password || password=="" || !password2 || password2==""){
            document.getElementById('error').innerHTML = "Falta algun campo para editar"
        }else if(password && password2 && password != password2){
            document.getElementById('error').innerHTML = "Las contraseñas no coinciden"
        }else if(username && password && password2){
            try{
                var token = localStorage.getItem('token')
                var login = JSON.parse(localStorage.getItem('login'))
            } catch(e){
                console.log(e)
                this.props.handleLogoutOK()
            } finally{
                if(!token || !login || token == null || login == null){
                    this.props.handleLogoutOK()
                }
            }
            try{
                var user = {id:this.state.user.id, username:username, password:password}
                var thisAux = this
                new Api().editUser(token, user).then(function(result){
                    if(result && result[0] && result[0].id){
                        thisAux.props.changeLogin({id:result[0].id, username:result[0].username})
                        thisAux.showEdit(false)
                        thisAux.setState({user:{id:result[0].id, username:result[0].username, countPhotos:thisAux.state.user.countPhotos}})
                        const usuario = {
                            username : result[0].username,
                            password : result[0].password
                        }
                        new Api().login(usuario).then(function(result){
                            console.log(result)
                            if(result && result[0] && result[0].token){
                                document.getElementById('error').innerHTML = ""
                                localStorage.setItem('token', result[0].token)
                                localStorage.setItem('login', JSON.stringify({id:result[0].id,username:result[0].username}))
                            } else if(result && result.error){
                                document.getElementById('error').innerHTML = result.error
                                localStorage.removeItem('token')
                                localStorage.removeItem('login')
                            } else{
                                document.getElementById('error').innerHTML = "Error desconocido"
                                localStorage.removeItem('token')
                                localStorage.removeItem('login')
                            }
                        }).catch(function(e){
                            console.log(e)
                            document.getElementById('error').innerHTML = "Error de conexion con la api (¿Está en funcionamiento?)"
                        })
                    }else if(result && result.error){
                        document.getElementById('error').innerHTML = result.error
                    }else{
                        document.getElementById('error').innerHTML = "Error desconocido"
                    }
                }).catch(function(e){
                    console.log(e)
                    document.getElementById('error').innerHTML = "Error de conexion con la api (¿Está en funcionamiento?)"
                })
            } catch(e){
                console.log(e)
            }
        }
    }

    componentDidMount() {
        this._ismounted = true
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
            var thisAux = this
            new Api().getUser(token, login.id).then(function (result) {
                if(result && result[0] && result[0].id){
                    console.log(result)
                    new Api().getPhotos(token, login.id).then(function (resultado) {
                        if(resultado && resultado[0] && resultado[0][0] && resultado[0][0].id){
                            var user = {id:result[0].id, username:result[0].username, countPhotos:resultado.length - 1}
                            thisAux.setState({user:user})
                        } else if(resultado && resultado.message && resultado.message=="No tienes fotos"){
                            var user = {id:result[0].id, username:result[0].username, countPhotos:0}
                            thisAux.setState({user:user})
                        }
                    })
                } else{
                    thisAux.goHome()
                }
            }).catch(function (e) {
                console.log(e)
                document.getElementById('error').innerHTML = "Error de conexion con la api (¿Está en funcionamiento?)"
            })
        } catch (e) {
            console.log(e)
        }
    }
    
    componentWillUnmount() {
        this._ismounted = false
    }

    render(){
        setTimeout(this.fecha,100)
        //document.getElementById("panelHeading").style.backgroundColor = "turquoise"
        if(!this.state.editUser){
            var info = <ul className="container details" >
                <li><p><span className="one" style={{'width':'40px', 'display': 'inline-block'}}><b>Id</b></span>{this.state.user.id}</p></li>
                <li><p><span className="glyphicon glyphicon-user one" style={{'width':'40px', 'display': 'inline-block'}}/>{this.state.user.username}</p></li>
                <li><p><span className="glyphicon glyphicon-camera one" style={{'width':'40px', 'display': 'inline-block'}}/><a onClick={this.goHome} href="">Click aquí para ver tus fotos</a></p></li>
            </ul>
            var buttons = <div>
                <button onClick={()=>this.showEdit(true)} type="button" className="btn btn-warning">Editar</button>
                <button onClick={this.goHome} style={{'float': 'right'}} type="button" className="btn btn-danger btn-close">Volver</button>
            </div>
        }else{
            var info = <EditUser user={this.state.user}/>
            var buttons = <div>
                <button onClick={this.edit} type="button" className="btn btn-success">Guardar cambios</button>
                <button onClick={()=>this.showEdit(false)} style={{'float': 'right'}} type="button" className="btn btn-danger btn-close">Cancelar</button>
            </div>
        }
        return <div><div className="panel-body" style={{'padding':'5px'}}>
                <div className="row">
                    <div className="col-md-4">
                        <img alt="User Pic" src="https://x1.xingassets.com/assets/frontend_minified/img/users/nobody_m.original.jpg" className="img-circle img-responsive"
                            style={{'maxWidth': '70%', 'maxHeight': '200px', 'margin': '0 auto', 'marginTop': '30px'}}/>
                    </div>
                    <div className="col-md-8" >
                        <div className="container" >
                            <h2>{this.state.user.username}</h2>
                            <p><b>{this.state.user.countPhotos}</b>  publicaciones</p>
                        </div>
                        <hr/>
                        {info}
                        <span id="error" className="help-block"></span>
                        <hr/>
                        <div className="col-sm-5 col-xs-6 tital" >Fecha: {this.state.fecha}</div>
                        <br/><br/>
                    </div>
                </div>
            </div>
            <div className="panel-footer" style={{'marginBottom':'-14px', 'backgroundColor':'white'}}>
                {buttons}
            </div>
        </div>
    }
}

class EditUser extends React.Component{
    constructor(props){
        super(props)
        this.state = {user: this.props.user, username: this.props.user.username, password: '', password2: ''}
        this.handleUser = this.handleUser.bind(this)
        this.handlePass = this.handlePass.bind(this)
        this.handlePass2 = this.handlePass2.bind(this)
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

    render(){
        return <form>
            <div className="input-group">
                <span className="input-group-addon"><i className="fa fa-user"></i></span>
                <input id="username" type="text" value={this.state.username} onChange={this.handleUser} className="form-control" placeholder="Introduzca su usuario" maxLength="30" autoComplete="off" autoFocus/>
            </div>
            <span className="help-block"></span>
            <div className="input-group">
                <span className="input-group-addon"><i className="fa fa-lock"></i></span>
                <input id="password" type="password" value={this.state.password} onChange={this.handlePass} className="form-control" placeholder="Introduzca la nueva contraseña" maxLength="30" autoComplete="off"/>
            </div>
            <span className="help-block"></span>
            <div className="input-group">
                <span className="input-group-addon"><i className="fa fa-lock"></i></span>
                <input id="password2" type="password" value={this.state.password2} onChange={this.handlePass2} className="form-control" placeholder="Confirme la nueva contraseña" maxLength="30" autoComplete="off"/>
            </div>
        </form>
    }
}

export {ShowUser}