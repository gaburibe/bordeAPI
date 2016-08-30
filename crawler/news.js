var url = require('url');
var fs = require('fs');
var http = require('http-get');
var request = require('request');
var _ = require('lodash');
var async=require('async');
var GoogleSearch = require('google-search');


/*

Funciones de apoyo a los otros módulos, generar reportes etc.



*/

module.exports = module.export =
{
	google: function( req, res, app, cb ){  //completa info de diputados desde el portal http://sil.gobernacion.gob.mx/
		var googleSearch = new GoogleSearch({
		  key: 'AIzaSyAC6MbaVtOZiYwi4mbyxFd901XTN2YLT2Y',
		  cx: '011771371522810610890:rvqnoy-1wr0'
		});
		
		 
		googleSearch.build({
		  q: "beltrones",
		  start: 1,
		  num: 20, // número de resultados (el máximo es 20) 
		  siteSearch: "", // Restringe url (no nos sirve mucho ahora) 
		  as_qdr:"d15" //Incluir solo resultados de las últimas dos semanas
		}, function(error, response) {
			console.log("respuesta")
		  console.log(response);
		});
	}
}


