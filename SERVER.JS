var express = require('express'),
    ejs = require('ejs');

var app = express();

//Hay que decirle a node que view engine se va a usar
app.set('view engine', 'ejs');

//routing
app.get('/', function(req, res){
    res.type('text/plain');
    res.send('Pagina principal de nuestro sitio');
});

app.get('/about', function(req, res){
    res.type('text/plain');
    res.send('Acerca de');
});

/*  probando un template con EJS
 res.type indica el tipo de la respuesta, si no se pone el navegador lo
 averigua por si mismo, si se pone se ahorra tiempo en tener que buscarlo.
 res.render procesa la vista que le indiquemos, le pasa los parametros
 que haya en el objeto como segundo argumento. Como tercer argumento tiene una
 función callback.
 Si usa el callback hay que poner explicitamente que envíe la vista procesada
 con res.send()
 */
app.get('/pruebaEjs', function(req, res){
    res.type('text/html');
    res.render('index', {
        tituloPagina: 'Mi primera pagina con EJS',
        tituloBody:'Probando EJS',
        seccion:'Aqui irá una seccion'
    }, function(err, html){
        if(err) throw err;
        res.send(html);
    });
});

/*  otro template EJS con mas parametros
 Aqui prescindimos de res.type y del callback.
 En esta ocasion le pasamos como parametros al EJS un array y un objeto para
 ver como se usan
 */
app.get('/pruebaEjs2', function(req, res){
    res.render('index2', {
        tituloPagina: 'Mi primera pagina con EJS',
        tituloBody:'Probando EJS',
        unArray: ['que', 'tal', 'estamos'],
        unObjeto: {
            primero:'pues',
            segundo:'estamos',
            tercero:'bastante bien'
        }
    });
});

/*  Aqui se complica un poco mas porque queremos incluir un partial (partial es
un trozo de codigo html que se incluye en la pagina, por ejemplo tenemos la
cabecera y el pie en archivos separados y los incluimos en el archivo que vayamos
a mostrar) en nuestra pagina index.ejs. Pero no estaticamente, que se hace con
include de ejs (ver index.ejs)
 Queremos procesar tb la seccion que queremos incluir, para ello usamos app.render
 que procesa la pagina que le indiquemos y la devuelve, igual que se hace con 
 res.render() y obtenemos el resultado en el callback que le pasamos.
 res.render() lo que hace es llamar internamente a app.render(), usamos app.render
 si queremos obtener la pagina procesada por cualquier motivo, en nuestro ejemplo
 el motivo es que queremos introducirla ya procesada en la otra pagina.
 Con el resultado de app.render() que es la variable html, llamamos a res.render
 como ya sabemos, y es en el objeto de parametros es cuando le ponemos la seccion
 procesada (html)
 */
app.get('/pruebaEjs3', function(req, res){
    app.render('sections/seccionDinamica',{
            mensaje:'Se ha procesado esta seccion antes de ' +
            'introducirla en la vista'},
        function(err, html){
            if (err) throw err;
            res.render('index.ejs',
                {
                    tituloPagina: 'Mi primera pagina con EJS',
                    tituloBody:'Probando EJS',
                    seccion: html
                }
            );
        }
    );
});

/*  En realidad no hace falta procesar el partial a parte, se puede incluir
    con include de ejs y tratarlo como si fuera una sola pagina con las variables
    ejs que haya en total.
    De todas formas lo anterior sigue siendo util porque asi podemos elegir en
    tiempo de ejecución que partial queremos incluir en la pagina.
*/
app.get('/pruebaEjs4', function(req, res){
    res.render('index3.ejs',
        {
            tituloPagina: 'Mi primera pagina con EJS',
            tituloBody:'Probando EJS',
            mensaje: 'Un mensaje cualquiera'
        }
    );
});

//Error 404
app.use(function(req, res){
    res.type('text/plain');
    res.status(404);
    res.send('404 - No encontrada');
});

// Pagina de error 500
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function(){
    console.log( 'Servidor iniciado en http://localhost:' + 
    app.get('port') + '; presiona Ctrl-C para terminar.' );
});