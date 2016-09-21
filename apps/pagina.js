
/*

	Principal endpoint para servir a las páginas

*/

"use strict();";


var _ = require('lodash')
	, async = require('async')
	, allowed = [ '_id',"ids", 'name' ]; 
var jsonfile = require('jsonfile');
if (process.env.NODE_ENV=='development') console.log("Pagina has loaded");




module.exports = module.export =
{
	portada: function apiGET ( req, res, app, cb )
	{
		var file = 'archivo/portada.json'
		jsonfile.readFile(file, function(err, obj) {
			theobject={dip:obj}
			res.end( JSON.stringify( theobject ) );
		})
	}

};