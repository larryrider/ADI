import React from 'react'
import Api from "./utils/api.js"

class ShowPhoto extends React.Component{
    constructor(props){
        super(props)
        this.editPhoto = this.editPhoto.bind(this)
        this.deletePhoto = this.deletePhoto.bind(this)
    }

    editPhoto(){
        this.props.editPhoto({idPhoto:this.props.idPhoto,
            src:this.props.src,
            title:this.props.title})
    }

    deletePhoto(){
        this.props.deletePhoto({idPhoto:this.props.idPhoto,
            src:this.props.src,
            title:this.props.title})
    }

    render(){
        var idPhoto = this.props.idPhoto
        var src = this.props.src
        var title = this.props.title
        var data_target = "#" + idPhoto

        return <div className="col-md-4 col-sm-6 co-xs-12 gal-item photo">
            <div className="box">
                <a href="#" data-toggle="modal" data-target={data_target}>
                    <img src={src} alt="URL incorrecta" style={{'width':'95%','height':'unset','top':'50%','left':'50%','position':'absolute','transform': 'translate(-50%,-50%)','maxHeight':' 95%'}}
                        ref={img => this.img = img} onError={()=>{if(this.props.src.indexOf('css/media/not_found.png') === -1) this.img.src = 'css/media/not_found.png'}} className="img-gallery"/>
                </a>
                <div className="modal fade" id={idPhoto} tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                                <h4 className="modal-title">{title}</h4>
                            </div>
                            <div className="modal-body centered-text">
                                <img src={src} alt="URL incorrecta" ref={img2 => this.img2 = img2} style={{'height':'unset', 'maxWidth':'70%'}}
                                    onError={()=>{if(this.props.src.indexOf('css/media/not_found.png') === -1) this.img2.src = 'css/media/not_found.png'}} className="img-modal" />
                            </div>
                            <div className="modal-footer">
                                <div style={{'float':'left'}}>
                                    <a href={src} id="url" target="_blank">{src}</a>
                                </div>
                                <div style={{'float':'right'}}>
                                    <button type="button" onClick={this.editPhoto} href="#" data-dismiss="modal" className="btn btn-warning">Editar</button>
                                    <button type="button" onClick={this.deletePhoto} href="#" data-dismiss="modal" className="btn btn-danger">Eliminar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

class EditPhoto extends React.Component{
    constructor(props){
        super(props)
        console.log(props.photo)

        this.state = {src:props.photo.src, title:props.photo.title}

        this.guardar = this.guardar.bind(this)
        this.cancelar = this.cancelar.bind(this)
        this.handleSrc = this.handleSrc.bind(this)
        this.handleTitle = this.handleTitle.bind(this)
    }

    guardar(event){
        event.preventDefault()
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
            var photo = {idPhoto:this.props.photo.idPhoto, src:this.state.src, title:this.state.title}
            var props = this.props
            new Api().editPhoto(token, login.id, photo).then(function(result){
                console.log(result)
                if(result && result[0] && result[0].id){
                    props.editPhoto(false)
                }else if(result && result.error){
                    document.getElementById('error').innerHTML = result.error
                }else{
                    document.getElementById('error').innerHTML = "Error desconocido"
                }
            }).catch(function(){
                document.getElementById('error').innerHTML = "Error de conexion con la api (¿Está en funcionamiento?)"
            })
        } catch(e){
        }
    }

    cancelar(){
        this.props.editPhoto(false)
    }

    handleSrc(src){
        this.setState({src:src.target.value})
        document.getElementById('error').innerHTML = ""
    }

    handleTitle(title){
        this.setState({title:title.target.value})
        document.getElementById('error').innerHTML = ""
    }
    
    render(){
        return <form action="" onSubmit={this.guardar}>
            <div className="panel-body" style={{'padding':'5px'}}>
                <div className="row">
                    <div className="text-center">
                        <img src={this.state.src} className="roundedCyan" alt="URL incorrecta" 
                            ref={img => this.img = img} onError={()=>{if(this.state.src.indexOf('css/media/not_found.png') === -1) this.img.src = 'css/media/not_found.png'}} style={{maxWidth:'30%', height:'auto'}}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12" style={{'paddingBottom':'10px'}}>
                        <div className="form-group">
                            <label className="control-label">Título</label>
                            <div className="input-group">
                                <span className="input-group-addon"><i className="fa fa-pencil"></i></span>
                                <input onChange={this.handleTitle} className="text" className="form-control" placeholder="Introduzca un título" value={this.state.title} maxLength="50"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12" style={{'paddingBottom':'10px'}}>
                        <div className="form-group">
                            <label className="control-label">Url</label>
                            <div className="input-group">
                                <span className="input-group-addon"><i className="fa fa-globe"></i></span>
                                <input onChange={this.handleSrc} className="text" className="form-control" placeholder="Introduzca una url" value={this.state.src} maxLength="100"/>
                            </div>
                        </div>
                        <div className="row">
                            <center><h5 id="error"></h5></center>
                        </div>
                    </div>
                </div>
            </div>  
            <div className="panel-footer" style={{'marginBottom':'-14px', 'backgroundColor':'white'}}>
                <button type="submit" className="btn btn-success">Editar</button>
                <button onClick={this.cancelar} style={{'float': 'right'}} type="button" className="btn btn-danger btn-close">Cancelar</button>
            </div>
        </form>
    }
}

class DeletePhoto extends React.Component{
    constructor(props){
        super(props)

        this.delete = this.delete.bind(this)
        this.cancelar = this.cancelar.bind(this)
    }

    delete(event){
        event.preventDefault()
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
            var idPhoto = this.props.photo.idPhoto
            var props = this.props
            new Api().deletePhoto(token, login.id, idPhoto).then(function(result){
                console.log(result)
                if(result && result.message && result.message=="Borrado correctamente"){
                    props.deletePhoto(false)
                }else if(result && result.error){
                    document.getElementById('error').innerHTML = result.error
                }else{
                    document.getElementById('error').innerHTML = "Error desconocido"
                }
            }).catch(function(){
                document.getElementById('error').innerHTML = "Error de conexion con la api (¿Está en funcionamiento?)"
            })
        } catch(e){
        }
    }
    
    cancelar(){
        this.props.deletePhoto(false)
    }

    render(){
        return <form action="" onSubmit={this.delete}>
            <div className="panel-body" style={{'padding':'5px'}}>
                <div className="row">
                    <div className="text-center" style={{'paddingBottom':'10px'}}>
                        <img src={this.props.photo.src} className="roundedRed" alt="URL incorrecta" style={{maxWidth:'30%', height:'auto'}}
                            ref={img => this.img = img} onError={()=>{if(this.props.photo.src.indexOf('css/media/not_found.png') === -1) this.img.src = 'css/media/not_found.png'}}/>
                    </div>
                </div>
                <div className="row">
                    <div className="text-center" style={{'paddingBottom':'10px'}}>
                        <label>Título:</label><span> </span>
                        <label> {this.props.photo.title}</label>
                    </div>
                </div>
                <div className="row">
                    <div className="text-center" style={{'paddingBottom':'10px'}}>
                        <label>Url:</label><span> </span>
                        <a href={this.props.photo.src} id="url" target="_blank">{this.props.photo.src}</a>
                    </div>
                    <div className="row">
                        <center><h5 id="error"></h5></center>
                    </div>
                </div>
            </div>  
            <div className="panel-footer" style={{'marginBottom':'-14px', 'backgroundColor':'white'}}>
                <button type="submit" className="btn btn-danger">Eliminar</button>
                <button onClick={this.cancelar} style={{'float': 'right'}} type="button" className="btn btn-default btn-close">Cancelar</button>
            </div>
        </form>
    }
}

class CreatePhoto extends React.Component{
    constructor(props){
        super(props)

        this.state = {src:'', title:''}

        this.crear = this.crear.bind(this)
        this.cancelar = this.cancelar.bind(this)
        this.handleSrc = this.handleSrc.bind(this)
        this.handleTitle = this.handleTitle.bind(this)
    }

    crear(event){
        event.preventDefault()
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
            var photo = {src:this.state.src, title:this.state.title}
            var props = this.props
            new Api().createPhoto(token, login.id, photo).then(function(result){
                console.log(result)
                if(result && result[0] && result[0].id){
                    props.createPhoto(false)
                }else if(result && result.error){
                    document.getElementById('error').innerHTML = result.error
                }else{
                    document.getElementById('error').innerHTML = "Error desconocido"
                }
            }).catch(function(){
                document.getElementById('error').innerHTML = "Error de conexion con la api (¿Está en funcionamiento?)"
            })
        } catch(e){
        }
    }

    cancelar(){
        this.props.createPhoto(false)
    }

    handleSrc(src){
        this.setState({src:src.target.value})
        document.getElementById('error').innerHTML = ""
    }

    handleTitle(title){
        this.setState({title:title.target.value})
        document.getElementById('error').innerHTML = ""
    }
    
    render(){
        return <form action="" onSubmit={this.crear}>
            <div className="panel-body" style={{'padding':'5px'}}>
                <div className="row">
                    <div className="text-center">
                        <img src={this.state.src} className="roundedCyan" alt="URL incorrecta"  style={{maxWidth:'30%', height:'auto'}}
                            ref={img => this.img = img} onError={()=>{if(this.state.src.indexOf('css/media/not_found.png') === -1) this.img.src = 'css/media/not_found.png'}}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12" style={{'paddingBottom':'10px'}}>
                        <div className="form-group">
                            <label className="control-label">Título</label>
                            <div className="input-group">
                                <span className="input-group-addon"><i className="fa fa-pencil"></i></span>
                                <input onChange={this.handleTitle} className="text" className="form-control" placeholder="Introduzca un título" value={this.state.title} maxLength="50" required/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12" style={{'paddingBottom':'10px'}}>
                        <div className="form-group">
                            <label className="control-label">Url</label>
                            <div className="input-group">
                                <span className="input-group-addon"><i className="fa fa-globe"></i></span>
                                <input onChange={this.handleSrc} className="text" className="form-control" placeholder="Introduzca una url" value={this.state.src} maxLength="100" required/>
                            </div>
                        </div>
                        <div className="row">
                            <center><h5 id="error"></h5></center>
                        </div>
                    </div>
                </div>
            </div>  
            <div className="panel-footer" style={{'marginBottom':'-14px', 'backgroundColor':'white'}}>
                <button type="submit" className="btn btn-primary">Crear Foto</button>
                <button onClick={this.cancelar} style={{'float': 'right'}} type="button" className="btn btn-danger btn-close">Cancelar</button>
            </div>
        </form>
    }
}

export {ShowPhoto,EditPhoto,DeletePhoto,CreatePhoto}