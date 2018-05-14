# ADI
Repositorio para las prácticas de Aplicaciones Distribuidas en Internet

## Curso 2017/2018

Esta práctica consta de dos partes, la parte del servidor HTTP  que es una **API REST** realizada con **Node** y **Express**, y la parte del frontend (que utiliza esta api) realizada en **ES6**+**React**+**Webpack**.
Los enunciados de las practicas + materiales se pueden encontrar en [ADI 17/18](https://github.com/ottocol/ADI1718).

## Primeros pasos

Para poner en funcionamiento esta práctica hacen falta varios pasos.

- Primero ejecutar el servidor que está dentro de 'larg1-api-adi,' por ejemplo podemos usar el comando 'nodemon main.js'.

- Después hay que ejecutar el wepack-server que está dentro de 'larg1-frontend-adi'. Para ello podemos ejecutar './node_modules/webpack-dev-server/bin/webpack-dev-server.js'.

[Documentacion de la API REST](https://documenter.getpostman.com/view/2789052/api-adi/71GzARf)

Partes opcionales:

- Si queremos acceder al 'index_std.html' hay que ejecutar en otra consola 'npm run watch' dentro del directorio 'larg1-frontend-adi'.

- Si queremos ejecutar los tests al servidor rest, tendremos que ejecutar dentro del directorio 'larg1-api-adi' el comando 'mocha test'.

- Para las demás partes opcionales implementadas no es necesario ejecutar ningún comando puesto que son partes de la propia aplicación, como por ejemplo la autenticación con Google usando **OAuth2**.

Otra parte opcional implementada es el punto de estilo visual. Para ello se ha hecho uso de bootstrap y de CSS implementado parte por mi y parte copiado de sitios externos. Puntualizar también que me he encargado de que el diseño sea lo más **responsive** posible.

Ya hay usuarios creados como por ejemplo admin/admin para acceder al cliente. Aunque siempre
se puede registrar uno nuevo.

*Aviso!!: todas las credenciales han sido eliminadas de este repositorio por seguridad y privacidad. Si se corrigen y se ponen unas correctas todo deberia funcionar correctamente.*

## Autores

- **Lawrence Rider García** - *Programador* - [Larry](http://www.larryrider.es)

Puedes ver también la lista de los [contribuidores](https://github.com/larryrider/ADI/contributors) que han participado en este proyecto.

## Licencia

Este proyecto está bajo la licencia GNU GPL - revisa [LICENSE](LICENSE) para ver más detalles.