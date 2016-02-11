var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var api = require('./apps/api');
var pagina = require('./apps/pagina');
var port="8080";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Cargar base.
require( './configdb.js' )( app );

// app.post('/diputados/get', function(req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
// });
// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  res.send('Borde Político API');
});
//DIPUTADOS
app.get('/diputados/test', function(req, res, next) {
  api.test( req, res, app, next );
});
app.get('/diputados/fill', function(req, res, next) {
  api.fill( req, res, app, next );
});
app.post('/diputados/get', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  api.get( req, res, app, next );
});
app.post('/portada/get', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  pagina.portada( req, res, app, next );
});
app.post('/diputados/', function(req, res, next) {
  api.post( req, res, app, next );
});
app.post('/diputados/addnews', function(req, res, next) {
  api.postnews( req, res, app, next );
});
app.put('/diputados/', function(req, res, next) {
  api.put( req, res, app, next );
});

app.listen(port);
console.log('Magic happens on port ' + port);
