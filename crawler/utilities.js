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
	addFromJson: function( req, res, app, cb ){  //completa info de diputados desde el portal http://sil.gobernacion.gob.mx/
		var obj;
		fs.readFile('archivo/sexo.json', 'utf8', function (err, data) {
		  if (err) throw err;
		  obj = JSON.parse(data);
		  	async.forEachSeries(obj, function(sub, callback) { 
		       subject=sub;
		       idd=subject[1].trim();
		       		       console.log(subject[1] , "-"+idd+"-");

		       app.models[ "diputados" ].update(idd , { sexo:subject[3] }).exec(function afterwards(err, upd){//{trayectoria:dip.trayectoria , silid:dip.uriid}).exec(function afterwards(err, updated){
				  		console.log("sexo updated",upd,err);
				  
				  	
					callback();
				});
		     	// callback();
		    }, function(err) {
		        res.end("DONE")
		    });
		});
	},
	makeMeAList: function ( req, res, app, cb ){ //Función de apollo para la creación de listas
		app.models[ "diputados" ].find().exec(function createCB(err, list){ 
			for(subject in list){
				dip=list[subject];
				console.log(dip.name,";",dip.id,";",dip.camara,dip.party);

			}
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
				temas2={}
				for (var j = 0; j < work.length; j++) {
					console.log(work[j].turnado,"---");
					if (work[j].turnado) {
						inicom=work[j].turnado.split( ".-" ); //".-Diputados -");
						idini=work[j].id;
						inicom.pop();
						inicom.shift();
						for (var k = 0; k < inicom.length; k++) {
							truecom=levPicker0(inicom[k],comsdip);
							console.log("-->",inicom[k],"-->",truecom[0],truecom[1]);
							temas[ truecom[1] ]+=1;
							if (truecom[1].length>3) {
								temas2[idini]=truecom[1];
								console.log("addin",truecom[1])
							}
						}
						
					}
				}
				//La lista se salva en e campo "temas"
				app.models[ "diputados" ].update({id:subject.id},{temas:temas,temas2:temas2}).exec(function afterwards(err, updated){//{trayectoria:dip.trayectoria , silid:dip.uriid}).exec(function afterwards(err, updated){
				  	console.log("temas updated",updated[0].temas,updated[0].temas2);
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
				temas2={}
				for (var j = 0; j < work.length; j++) {
					console.log(work[j].turnado,"---");
					if (work[j].turnado) {
						idini=work[j].id;
						inicom=work[j].turnado.split( ".-" ); //".-Diputados -");
						inicom.pop();
						inicom.shift();
						for (var k = 0; k < inicom.length; k++) {
							truecom=levPicker0(inicom[k],comsdip);
							console.log("-->",inicom[k],"-->",truecom[0],truecom[1]);
							temas[ truecom[1] ]+=1;
							if (truecom[1].length>3) {
								temas2[idini]=truecom[1];
								console.log("addin",truecom[1])
							}
						}
					}
				}
				//La lista se salva en e campo "temas"
				app.models[ "diputados" ].update({id:subject.id},{temas:temas,temas2:temas2}).exec(function afterwards(err, updated){//{trayectoria:dip.trayectoria , silid:dip.uriid}).exec(function afterwards(err, updated){
				  	console.log("temas updated",updated[0].temas);
					callback();
				});
				

		    }, function(err) {
		        res.end("DONE")
		    });
			
			
		});
		
	},
	statsComisiones: function ( req, res, app, cb ){
		var comssen = JSON.parse(fs.readFileSync('crawler/comsenadores.json', 'utf8'));
		var comsdip = JSON.parse(fs.readFileSync('crawler/comdiputados.json', 'utf8'));
		statsdip={};
		statssen={};
		//obtener todas las iniciativas
		app.models[ "trabajo" ].find({type:"i"}).exec(function createCB(err, inis){ 
			var comisiones={};
			async.forEachSeries(inis, function(ini, callback) { 
					if (ini.estado.indexOf("RETIRAD")>-1) {
						// console.log("retirada")	
					}
		       		else if (ini.camara=="diputados") {
		       			turnado=cleancom(ini.turnado);
		       			inicom=turnado.split( ".-" ); //".-Diputados -");
						// inicom.pop();
						// inicom.shift();
						salida=0;
						if (ini.estado.indexOf("PUBLICADO")>-1 || ini.estado.indexOf("TURNADO")>-1 || ini.estado.indexOf("DICTAMEN NEGATIVO")>-1 || ini.estado.indexOf("CAMARA REVISORA")>-1) {
							salida=1;
						}
						for (var k = 0; k < inicom.length; k++) {
							//cleancom(inicom[k]);
							truecom=levPicker(inicom[k],comsdip);
							if (!statsdip[ truecom[0] ]) {
								statsdip[ truecom[0] ]={salida:salida,entrada:1};
							}
							else{
								if (salida) { statsdip[ truecom[0] ].salida+=1; }
								statsdip[ truecom[0] ].entrada+=1;
							}
							if (truecom.indexOf("turismo")>-1) {console.log("deporte",ini.resumen,"--->",turnado,"--->",ini.origen,ini.presentacion,ini.estado)}
						}
		       		}
		       		else{
		       			turnado=cleancom(ini.turnado);
		       			inicom=turnado.split( ".-" );
		       			// inicom=ini.turnado.split( ".-" ); //".-Diputados -");
						// inicom.pop();
						// inicom.shift();
						salida=0;
						if (ini.estado.indexOf("PUBLICADO")>-1 || ini.estado.indexOf("TURNADO")>-1 || ini.estado.indexOf("DICTAMEN NEGATIVO")>-1 || ini.estado.indexOf("CAMARA REVISORA")>-1) {
							salida=1;
						}

						for (var k = 0; k < inicom.length; k++) {
							truecom=levPicker(inicom[k],comssen);
							if (!statssen[ truecom[0] ]) {
								statssen[ truecom[0] ]={salida:salida,entrada:1};
							}
							else{
								if (salida) { statssen[ truecom[0] ].salida+=1; }
								statssen[ truecom[0] ].entrada+=1;
							}
						}
		       		}
		       		callback();

		    }, function(err) {
		    	console.log("Comisiones diputados")
		    	printCSV(statsdip)
		    	console.log("Comisiones Senadores")
		    	printCSV(statssen)
		    	
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
	},
	tresdetres: function ( camara, req, res, app, cb ){ //crawl página de tres de tres
		dipnames={};
		app.models[ "diputados" ].find({ camara:camara }, { name: 1 }).exec(function createCB(err, list){ 
			for(subject in list){
				dip=list[subject];
				dipnames[dip.name]=dip.id;
			}
			if (camara=="diputados") {c.queue('http://3de3.mx/api/apiv1/2015/candidatos/ganadores?cargo=Diputado%20Federal');} //llamada API página
			if (camara=="senadores") {c.queue('http://3de3.mx/api/apiv1/2015/candidatos/ganadores?cargo=Senador');} //llamada API página
			
			
		});
		var c = new Crawler({
		    maxConnections : 2,
		    forceUTF8:true,	
		    callback : function (error, result, $) {
		    	res = JSON.parse(result.body);
		    	sitienen=res.candidatos;
		    	async.forEachSeries(sitienen, function(legis, callback) {
		    		match=levPicker0(legis.nombres+" "+legis.apellido_paterno+" "+legis.apellido_materno,dipnames);
		    		console.log(legis.nombres+" "+legis.apellido_paterno+" "+legis.apellido_materno,"-->",match);
		    		app.models[ "diputados" ].update({name:match[0]},{tresdetres:1}).exec(function afterwards(err, updated){
					  	console.log('Updated',updated,err);	
					  	callback();
					});
		    	}, function(err) {
		    		console.log("DONE");
		    	});
		        
		    }
		});
		
	}
}
function levPicker(str,obj){ //cicla un array para obtener el mejor match (levenshtein) en el
	max=100;
	maxname="none";
	for (name in obj) {
		if (str && str.length>0 && name && name.length>0) {
			ratio=levMatcher( standard(str) , standard(name) );
			if (ratio<max) {
				max=ratio;
				maxname=name;
			}
		}
		
	}
	if (max>20) {return ["-","-"];}
	else{
		return [standard(maxname),standard(obj[maxname]) ];
	}
	
}
function levPicker0(str,obj){ //cicla un array para obtener el mejor match (levenshtein) en el
	max=100;
	maxname="none";
	for (name in obj) {
		if (str && str.length>0 && name && name.length>0) {
			ratio=levMatcher( standard(str) , standard(name) );
			if (ratio<max) {
				max=ratio;
				maxname=name;
			}
		}
		
	}
	// if (max>20) {return ["-","-"];}
	// else{
		return [standard(maxname),standard(obj[maxname]) ];
	//}
	
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
function printCSV(object){
	for (com in object) {
		console.log(com ,";", object[com].entrada , ";" ,object[com].salida);
	};
}
function cleancom(turno){
	r="";
	r=turno.replace(/Para dictamen/gi, "");
	r=r.replace(/Diputados/gi, "");
	r=r.replace(/Senadores/gi, "");
	r=r.replace(/Para opinión/gi, "");
	return r;
}

