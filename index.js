var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var legisladores = require('./apps/legisladores');
var news = require('./apps/news');
var trabajo = require('./apps/trabajo');
var pagina = require('./apps/pagina');
var borde_fed = require('./borde/score');

var crawl_fed = require('./crawler/federal');
var crawl_u = require('./crawler/utilities');

var port="8080";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Cargar base.
require( './configdb.js' )( app );

// app.post('/diputados/get', function(req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
// });
// respond with "hello world" when a GET request is made to the homepage
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://thegardenreview.net");
  res.header("Access-Control-Allow-Origin", "http://localhost");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  next();
});
app.get('/', function(req, res) {
  res.send('Borde Político API v1.1');
});
//DIPUTADOS
app.get('/diputados/test', function(req, res, next) {
  legisladores.test( req, res, app, next );
});
app.get('/diputados/fill', function(req, res, next) {
  legisladores.fill( req, res, app, next );
});
app.post('/diputados/get', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  legisladores.get( req, res, app, next );
});
app.post('/portada/get', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  pagina.portada( req, res, app, next );
});
app.post('/diputados/', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  legisladores.post( req, res, app, next );
});
app.post('/diputados/addinis', function(req, res, next) {
  // res.setHeader('Access-Control-Allow-Origin', '*');
  legisladores.postini( req, res, app, next );
});
app.put('/diputados/', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  legisladores.put( req, res, app, next );
});
app.delete('/diputados/', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  legisladores.del( req, res, app, next );
});
//NEWS
app.post('/news/', function(req, res, next) {
  // res.setHeader('Access-Control-Allow-Origin', '*');
  news.post( req, res, app, next );
});
app.post('/news/get', function(req, res, next) {
  // res.setHeader('Access-Control-Allow-Origin', '*');
  news.get( req, res, app, next );
});
app.delete('/news/', function(req, res, next) {
  // res.setHeader('Access-Control-Allow-Origin', '*');
  news.del( req, res, app, next );
});
app.post('/diputados/news', function(req, res, next) {
  // res.setHeader('Access-Control-Allow-Origin', '*');
  legisladores.postnews( req, res, app, next );
});
//TRABAJO LEJISLATIVO
app.post('/diputados/trabajo', function(req, res, next) {
  // res.setHeader('Access-Control-Allow-Origin', '*');
  legisladores.postwork( req, res, app, next );
});
app.post('/trabajo', function(req, res, next) {
  // res.setHeader('Access-Control-Allow-Origin', '*');
  trabajo.post( req, res, app, next );
});
app.delete('/trabajo/', function(req, res, next) {
  // res.setHeader('Access-Control-Allow-Origin', '*');
  trabajo.del( req, res, app, next );
});


//CRAWLERS

app.get('/crawl/federal/dip/sil',function(req, res, next) {
  crawl_fed.diputadosSIL(req, res, app, next);//diputados(req, res, app, next);
})
app.get('/crawl/federal/sen/sil',function(req, res, next) {
  crawl_fed.senadoresSIL(req, res, app, next);
})
app.get('/crawl/federal/sen',function(req, res, next) {
  crawl_fed.senadores2(req, res, app, next);
})
app.get('/crawl/federal/sent',function(req, res, next) {
  crawl_fed.senadoresSIL(req, res, app, next);//diputados(req, res, app, next);
})
app.get('/crawl/federal/iniciativas',function(req, res, next) {
  crawl_fed.iniciativas(req, res, app, next);
})
app.get('/crawl/federal/pas',function(req, res, next) {
  crawl_fed.pas(req, res, app, next);
})
app.get('/crawl/federal/dipasist',function(req, res, next) {
  crawl_fed.dipAsist(req, res, app, next);
})

//Análisis

app.get('/borde/federal/historico/sen',function(req, res, next) {
  borde_fed.senH(req, res, app, next);
})
app.get('/borde/federal/historico/dip',function(req, res, next) {
  borde_fed.dipH(req, res, app, next);
})
app.get('/borde/federal/historico/dipchafa',function(req, res, next) {
  borde_fed.dipchafa(req, res, app, next);
})
app.get('/borde/federal/historico/senchafa',function(req, res, next) {
  borde_fed.senchafa(req, res, app, next);
})
// app.get('/crawl/federal/pas',function(req, res, next) {
//   crawl_fed.pas(req, res, app, next);
// })
app.get('/crawl/utilities',function(req, res, next) {
  crawl_u.news(req, res, app, next);
})
app.get('/crawl/utilities/bss',function(req, res, next) {
  crawl_u.bss(req, res, app, next);
})
app.get('/utilities/enlistCategories',function(req, res, next) {
  crawl_u.enlistCateg(req, res, app, next);
})
app.get('/utilities/checkok',function(req, res, next) {
  crawl_u.checkok(req, res, app, next);
})
app.get('/utilities/linkwork',function(req, res, next) {
  crawl_u.linkwork(req, res, app, next);
})
app.get('/utilities/addips',function(req, res, next) {
  crawl_u.addips(req, res, app, next);
})
app.get('/utilities/getbs',function(req, res, next) {
  crawl_u.getbs(req, res, app, next);
})



app.listen(port)
//app.listen(process.env.PORT)
//app.listen(port);
console.log('Magic happens on port ' + port);
