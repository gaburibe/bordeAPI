var Crawler = require("crawler");
var url = require('url');
var fs = require('fs');
var http = require('http-get');
var request = require('request');
var _ = require('lodash');
var async=require('async');
var Iconv  = require('iconv').Iconv;
var async=require('async');
var moment=require('moment');
var Levenshtein=require('levenshtein');
moment.locale('es');
var news_array=[];
var bscore={}
var dipuvar=[];
var updatelist={};
orderednews={};

/*

Funciones de apoyo a los otros módulos, generar reportes etc.



*/

module.exports = module.export =
{
	statsComisiones: function ( req, res, app, cb ){
		levMatcher("Bananas","bananaz");
		//obtener todos los legislaores y us iniciativas
		app.models[ "trabajo" ].find().exec(function createCB(err, trs){ 
			var comisionesDip={};
			var comisionesSen={};
			for (var i = 0; i < trs.length; i++) {
				
				
				console.log(trs[i].name, trs[i].work.length);
			}
			console.log(comisiones);
			res.end( "1" );
		});
		
	},
	linkTemasDip: function ( req, res, app, cb ){
		levMatcher("Bananas","bananaz");
		var comsdip = JSON.parse(fs.readFileSync('crawler/comdiputados.json', 'utf8'));
		
		//obtener todos los legislaores y us iniciativas
		app.models[ "diputados" ].find({camara:"diputados"}).populate("work").exec(function createCB(err, trs){ 
			var comisiones={};
			async.forEachSeries(trs, function(subject, callback) { 
		       
		       	console.log(subject.name, subject.work.length);

				work=subject.work;
				temas={
					"medio ambiente":0,
					"economía":0,
					"gobierno":0,
					"seguridad y justicia":0,
					"educación y cultura":0,
					"salud":0
				}
				for (var j = 0; j < work.length; j++) {
					console.log(work[j].turnado,"---");
					if (work[j].turnado) {
						inicom=work[j].turnado.split( ".-" ); //".-Diputados -");
						inicom.pop();
						inicom.shift();
						for (var k = 0; k < inicom.length; k++) {
							truecom=levPicker(inicom[k],comsdip);
							console.log("-->",inicom[k],"-->",truecom[0],truecom[1]);
							temas[ truecom[1] ]+=1;
						}
					}
				}
				//La lista se salva en e campo "temas"
				app.models[ "diputados" ].update({id:subject.id},{temas:temas}).exec(function afterwards(err, updated){//{trayectoria:dip.trayectoria , silid:dip.uriid}).exec(function afterwards(err, updated){
				  	console.log("temas updated",updated[0].temas);
					callback();
				});
				

		    }, function(err) {
		        res.end("DONE")
		    });
			
			
		});
		
	},
	linkTemasSen: function ( req, res, app, cb ){
		var comsdip = JSON.parse(fs.readFileSync('crawler/comsenadores.json', 'utf8'));
		
		//obtener todos los legislaores y us iniciativas
		app.models[ "diputados" ].find({camara:"senadores"}).populate("work").exec(function createCB(err, trs){ 
			var comisiones={};
			async.forEachSeries(trs, function(subject, callback) { 
		       
		       	console.log(subject.name, subject.work.length);

				work=subject.work;
				temas={
					"medio ambiente":0,
					"economía":0,
					"gobierno":0,
					"seguridad y justicia":0,
					"educación y cultura":0,
					"salud":0
				}
				for (var j = 0; j < work.length; j++) {
					console.log(work[j].turnado,"---");
					if (work[j].turnado) {
						inicom=work[j].turnado.split( ".-" ); //".-Diputados -");
						inicom.pop();
						inicom.shift();
						for (var k = 0; k < inicom.length; k++) {
							truecom=levPicker(inicom[k],comsdip);
							console.log("-->",inicom[k],"-->",truecom[0],truecom[1]);
							temas[ truecom[1] ]+=1;
						}
					}
				}
				//La lista se salva en e campo "temas"
				app.models[ "diputados" ].update({id:subject.id},{temas:temas}).exec(function afterwards(err, updated){//{trayectoria:dip.trayectoria , silid:dip.uriid}).exec(function afterwards(err, updated){
				  	console.log("temas updated",updated[0].temas);
					callback();
				});
				

		    }, function(err) {
		        res.end("DONE")
		    });
			
			
		});
		
	},
	enlistBS: function ( req, res, app, cb ){
		app.models[ "diputados" ].find({camara:"diputados"}).exec(function createCB(err, trs){
			bsl={};
			for (var i = 0; i < trs.length; i++) {
				bsl[ trs[i].bs.rb ]={name:trs[i].name,id:trs[i].id,imageurl:trs[i].imageurl};
			}
			for (var i = 1; i < 11; i++) {
				console.log(i,bsl[i]);
			};

		});
		
	},
	enlistInis: function ( req, res, app, cb ){ //Enlista todas las iniciativas
		console.log("cámara;partido,estado");
		app.models[ "trabajo" ].find({type:"i"}).exec(function createCB(err, inis){
			st="cámara;partido;estado;resumen";
			for (var i = 0; i < inis.length; i++) {
				if (inis[i].partido) {
					
				}
				console.log(inis[i].camara+";"+inis[i].partido+";"+inis[i].estado+";"+inis[i].resumen);
				st+=inis[i].camara+";"+inis[i].partido+";"+inis[i].estado+";"+inis[i].resumen+"\n";
				
			}
			res.end( st );

		});
		 
	},
	bss: function ( req, res, app, cb ){
		for(iddip in bscore){
			bscore[iddip].id=iddip;
			//console.log(bscore[iddip].bs)
		}
		async.eachSeries(bscore, function iteratee(item, callback) {
		    	app.models[ "diputados" ].update(item.id , {bs:item.bs}).exec(function createCB(err, created){
		    		 console.log("udated",created[0].name,created[0].bs);
		    		callback(null, created[0]);
		           
		        });
		         // if many items are cached, you'll overflow
		   
		}, function done() {
		    //...
		});
		
	},
	enlistCateg: function ( req, res, app, cb ){

		app.models[ "trabajo" ].find({type:"i"}).exec(function createCB(err, trs){
			allcateg={};
			for (var i = 0; i < trs.length; i++) {
				if (allcateg[trs[i]]) {allcateg[trs[i].estado]+=1;}
				else{allcateg[trs[i].estado]=1;}
				
			}
	    	console.log(err, allcateg);
		    cb(allcateg);      
		});
		
	},
	linkwork: function ( req, res, app, cb ){
		app.models[ "diputados" ].find().exec(function dipCB(err, dips){
			diputados={};
			for (var i = 0; i < dips.length; i++) {
				if(dips[i].uriid){
					diputados[dips[i].id]=dips[i];
				}
			}
			//console.log("diputados",diputados);
	    	app.models[ "trabajo" ].find().exec(function findCB(err, trs){
	    		allcateg={};
	    		async.forEachSeries(trs, function(iniciativa, callback) {
	    			async.forEachSeries(iniciativa.autor, function(autor, callback2) {
	    				matches=0;
	    				for (var i = 0; i < dips.length; i++) {
	    					if (autor.ref) {
		    					if(autor.ref == dips[i].silid){
		    						matches+=1;
		    						console.log("match!",dips[i].silid,dips[i].name,autor.ref);
		    						app.models[ "diputados" ].find({silid:dips[i].silid}).exec(function(e,r){
									  r[0].work.add(iniciativa.id);
									  r[0].save(function(err,res){
									    console.log("link saved",res);
									    //callback2();
									  });
									});
		    						
		    					}
		    					else{
		    						//console.log("not match");
		    						//callback2();
		    					}
	    					}
	    					else{
	    						console.log("not match");
	    					}
	    					
	    				}
	    				console.log(autor);
	    				//if (matches == 0) {callback2();}
	    				callback2();
	    			}, function(err) {
				        callback();
				    });
			    }, function(err) {
			        cb();
			    });

			    console.log("--");
		    	      
			});    
		});
	},
	checkok: function ( req, res, app, cb ){ //checa que no haya diputados sin id de SIL

		app.models[ "diputados" ].find().exec(function createCB(err, trs){
			c_sidid=0;
			c_inis=0;
			for (var i = 0; i < trs.length; i++) {
				//console.log(trs[i].name,trs[i].silid,trs[i].uriid);
				
				if (trs[i].silid && trs[i].silid>0) {
					c_sidid+=1;
					//console.log(trs[i].name,trs[i].silid,trs[i].uriid);
				}
				else{
					console.log(trs[i].name,trs[i].uriid);
				}
				
			}
			console.log("senadores:",trs.length);
			console.log("sil:",c_sidid,"--")
		});
		
	},
	getbs: function ( req, res, app, cb ){

		app.models[ "diputados" ].find({camara:"diputados"}).exec(function createCB(err, trs){

			ranks=[];
			ranks_ini=[];
			ranks_pa=[];
			ranks_debate=[];
			ranks_asistencia=[];
			bs={};
			dips={};

			for (var i = 0; i < trs.length; i++) {
				
				bs=trs[i].bs;
				console.log(trs[i].bs);
				if ( ranks_asistencia.indexOf(trs[i].bs.asistencia)<0 ) {
					ranks_asistencia.push(trs[i].bs.asistencia);
				}
				bs.inis=trs[i].bs.inis;
				if ( ranks_ini.indexOf(trs[i].bs.inis)<0 ) {
					ranks_ini.push(trs[i].bs.inis);
				}
				bs.pas=trs[i].bs.pas;
				if ( ranks_pa.indexOf(trs[i].bs.pas)<0 ) {
					ranks_pa.push(trs[i].bs.pas);
				}
				bs.debate=trs[i].bs.debate;
				if ( ranks_debate.indexOf(trs[i].bs.debate)<0 ) {
					ranks_debate.push(trs[i].bs.debate);
				}

				if ( ranks.indexOf(trs[i].bs.bs)<0 ) {
					ranks.push(trs[i].bs.bs);
				}
				ranks.sort(function(a, b){return b-a});
				ranks_ini.sort(function(a, b){return b-a});
				ranks_pa.sort(function(a, b){return b-a});
				ranks_asistencia.sort(function(a, b){return b-a});


			}

			console.log("senadores:",trs.length);
			console.log(ranks);
			async.forEachSeries(trs, function(legis, callback) { 

				bs={};
				console.log(legis.name);
				bs=legis.bs;
				for (var i = 0; i < ranks.length; i++) {
					if(bs.bs==ranks[i]){
						bs.r=i;
					}
				}
				for (var i = 0; i < ranks_pa.length; i++) {
					if(bs.pas==ranks_pa[i]){
						bs.r_pa=i;
					}
				}
				for (var i = 0; i < ranks_debate.length; i++) {
					if(bs.debate==ranks_debate[i]){
						bs.r_debate=i;
					}
				}
				for (var i = 0; i < ranks_ini.length; i++) {
					if(bs.inis==ranks_ini[i]){
						bs.r_ini=i;
					}
				}
				for (var i = 0; i < ranks_asistencia.length; i++) {
					if(bs.asistencia==ranks_asistencia[i]){
						bs.r_asistencia=i;
					}
				}
				app.models[ "diputados" ].update(legis.id, {bs:bs}).exec(function createCB(err, created){
		            console.log("updated",created[0].name,created[0].bs);
		            callback();
		        });
		      	
		    }, function(err) {
		        console.log("DONE")
		    });
					

		});
	}
}
function levPicker(str,obj){ //cicla un array para obtener el mejor match (levenshtein) en el
	max=100;
	maxname="none";
	for (name in obj) {
		if (str && str.length>0 && name && name.length>0) {
			ratio=levMatcher( standard(str) , standard(name) );
			// console.log(standard(str),standard(name),ratio);
			if (ratio<max) {
				max=ratio;
				maxname=name;
			}
		}
		
	}
	return [standard(maxname),standard(obj[maxname]) ];
}
function levMatcher(st1,st2){ //implementción de comparación de levenshtein
	var dl=new Levenshtein( st1, st2 );
	return dl.distance;
}
function partialMatcher(match,list){ //IMPORTANTE
	for(name in list){
		subject=list[name];
		console.log(112,subject);
	}
}
function standard(str){
	str=str.toLowerCase();
	str=str.trim();
	return str
}

