
var fs = require('fs');
var _ = require('lodash');
var async=require('async');
var Iconv  = require('iconv').Iconv;
var moment=require('moment');
moment.locale('es');
var jsonfile = require('jsonfile');


function nextdip(){

}

module.exports = module.export =
{
	//Función que crea JSON "cache"
	createPortada: function(app, res, cb){ 
		app.models[ "diputados" ].find({ select: [ //Incluir aquí campos necesarios en portada
		'name',
		'camara',
		'eleccion',
		'party',
		'sexo',
		'temas',
		'age',
		] }).where( {ordenDeGobierno : "federal"} ).exec(function (errfind, found){
			console.log(errfind, found);
			var file = 'archivo/portada.json';
			var obj = found;
			 
			jsonfile.writeFile(file, obj, function (err) { //se genera el archivo "cache"
			  console.error(err)
			  cb();
			})
		});
	}

	
}
