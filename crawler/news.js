var url = require('url');
var fs = require('fs');
var http = require('http-get');
var request = require('request');
var _ = require('lodash');
var async=require('async');
var GoogleSearch = require('google-search');
var moment=require('moment');

/*

Funciones de apoyo a los otros módulos, generar reportes etc.



*/

module.exports = module.export =
{
	google: function( req, res, app, cb ){  //completa info de diputados desde el portal http://sil.gobernacion.gob.mx/
		var googleSearch = new GoogleSearch({
		  key: 'AIzaSyClMX-nxUw07N8r30WSXohdcPV69vBX3Ck',
		  cx: '013091804763330334701:gyyelad0wru'
		});
		makeList(app, function(err, dips){ // obtener los diputados que aun no han sido buscados
			searchList={};
			idList={};
			for(numdip in dips){
				dip=dips[numdip];
				search_name=dip.nombres+" "+dip.apellido_paterno;
				searchList[dip.id]=search_name;
				idList[search_name]=dip.id;
				
			}
			console.log(searchList);
			async.forEachSeries(searchList, function(legis, callback) {
				console.log(legis);

	    		googleSearch.build({
				  q: legis,
				  as_qdr:"d7" //Incluir solo resultados de las últimas dos semanas
				}, function(error, response) {
					idl=idList[legis];
					unixdate=moment().unix();
					app.models[ "diputados" ].update({id:idl},{c_news:unixdate,c_news_r:response.items}).exec(function afterwards(err, updated){//{trayectoria:dip.trayectoria , silid:dip.uriid}).exec(function afterwards(err, updated){
					  	console.log('Updated ');
				  		callback();

					});
					console.log("respuesta",idl,unixdate)
					console.log("error",response.error);
				});
	    		
	    		
	    	}, function(err) {
	    		res.end("DONE")
	    	});
			
		});
		 
		
	}
	
}
function makeList ( app, done){  //completa info de diputados desde el portal http://sil.gobernacion.gob.mx/
	unixdate=moment().unix();
	app.models[ "diputados" ].find({limit: 95, sort: 'c_news ASC' }).exec(function (err, dips){
		  if (err) {
		  	done(err,"--");
		    console.log(err);
		  }
		  else{
		  	done(null,dips);
		  }
	});
}

