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
moment.locale('es');
var news_array=[
["Avalan en comisiones dictamen sobre suspensión de garantías; MORENA va en contra	","	Noticias MVS	","	3/29/2016	","	http://www.noticiasmvs.com/#!/noticias/avalan-en-comisiones-dictamen-sobre-suspension-de-garantias-morena-va-en-contra-928"],
["¿Diputados de 18 años de edad? Avanza la propuesta legislativa","	Excélsior	","	3/29/2016	","	http://www.excelsior.com.mx/nacional/2016/03/29/1083463		"],
["Senadores del PRD piden a gobierno de EPN sumarse a #MXcontraTrump	","	Economía Hoy	","	3/29/2016	","	http://www.economiahoy.mx/nacional-eAm-mx/noticias/7452778/03/16/Senadores-mexicanos-invitan-al-Gobierno-a-sumarse-a-su-campana-contra-Trump.html		"],
["Disciplina financiera “detonará” inversiones	","	Sol de México	","	3/24/2016	","	http://elsoldemexico.com.mx/finanzas/159320-disciplina-financiera-detonara-inversiones		"],
["Urge poner fin al abuso en el endeudamiento de estados y municipios: PAN	","	Excélsior	","	3/27/2016	","	http://www.excelsior.com.mx/nacional/2016/03/27/1083126		"],
["Diputados urgen a concretar leyes anticorrupción	","	El Financiero	","	3/28/2016	","	http://www.elfinanciero.com.mx/nacional/diputados-urgen-a-concretar-leyes-anticorrupcion.html		"],
["Senadores aprueban dictamen para reformar ley de APPs	","	La Jornada	","	3/17/2016	","	http://www.jornada.unam.mx/ultimas/2016/03/17/senadores-aprueban-dictamen-para-reformar-ley-de-apps-3396.html		"],
["Aprueban Ley de Asociaciones Público Privadas	","	Crónica	","	3/17/2016	","	http://www.cronica.com.mx/notas/2016/950848.html		"],
["Diputados de la comisión que investiga el caso Iguala se reunirán con Murillo Karam	","	SDP Noticias	","	3/30/2016	","	http://www.sdpnoticias.com/nacional/2016/03/30/diputados-de-la-comision-que-investiga-el-caso-iguala-se-reuniran-con-murillo-karam		"],
["GIEI debe continuar investigación: PAN	","	Excélsior	","	3/30/2016	","	http://www.excelsior.com.mx/nacional/2016/03/30/1083689		"],
["Senado rechaza tratar como urgente estrategia contra Trump	","	El Universal	","	3/30/2016	","	http://www.eluniversal.com.mx/articulo/nacion/politica/2016/03/30/senado-rechaza-tratar-como-urgente-estrategia-contra-trump		"],
["Diputados revisarán 140 leyes por desindexación del salario mínimo	","	El Financiero	","	3/30/2016	","	http://www.elfinanciero.com.mx/nacional/diputados-revisaran-140-leyes-por-desindexacion-del-salario-minimo.html?platform=hootsuite		"],
["Senadores piden a Gobierno Federal intervenga en Veracruz 	","	Radio Fórmula 	","	3/29/2016	","	http://www.radioformula.com.mx/notas.asp?Idn=582022&idFC=2016		"],
["Avanza reforma que permite estado de excepción	","	La Jornada	","	3/29/2016	","	http://www.jornada.unam.mx/ultimas/2016/03/29/avalan-diputados-reforma-que-permite-estado-de-excepcion-851.html		"],
["Senadores aducen baja en aprobación de EPN a mal manejo de problemas	","	El Universal	","	3/14/2016	","	http://www.eluniversal.com.mx/articulo/nacion/politica/2016/03/14/senadores-aducen-baja-en-aprobacion-de-epn-mal-manejo-de		"],
["Y ahora qué hacemos con el Mando Único	","	Animal Político	","	3/10/2016	","	http://www.animalpolitico.com/blogueros-el-blog-de-mexico-evalua/2016/03/10/que-hacemos-con-el-mando-unico/		"],
["El 6 de abril, reunión de diputados con Murillo Karam por caso Ayotzinapa	","	Aristegui Noticias	","	3/30/2016	","	http://aristeguinoticias.com/3003/mexico/el-6-de-abril-reunion-de-diputados-con-murillo-karam-por-caso-ayotzinapa/		"],
["Tunden a diputados del PRI que se subieron al Metro (Video)	","	Aristegui Noticias	","	3/18/2016	","	http://aristeguinoticias.com/1803/mexico/tunden-a-diputados-del-pri-que-se-subieron-al-metro-video/		"],
["Senadores que mueren de cáncer en LXII y LXIII legislaturas	","	Publimetro	","	3/15/2016	","	http://www.publimetro.com.mx/noticias/senadores-que-mueren-de-cancer-en-lxii-y-lxiii-legislaturas/mpco!HPT9EwWiaoGg/		"],
["Senado apoya a la UNAM para recuperar el auditorio \"Che Guevara\"	","	W Radio	","	3/12/2016	","	http://wradio.com.mx/radio/2016/03/12/nacional/1457749159_451653.html		"],
["Desayunan senadores con discapacitados	","	Reforma	","	3/15/2016	","	http://www.reforma.com/aplicaciones/articulo/default.aspx?Id=793976&v=3		"],
["Senadores pevemistas piden a diputados aprobar Ley de Calidad del Aire	","	20 Minutos	","	3/18/2016	","	http://www.20minutos.com.mx/noticia/74534/0/senadores-pevemistas-piden-a-diputados-aprobar-ley-de-calidad-del-aire/		"],
["Hacienda pide irse por la libre… el Congreso dice sí	","	Animal Político	","	3/17/2016	","	http://www.animalpolitico.com/blogueros-el-blog-de-mexico-evalua/2016/03/17/hacienda-pide-irse-por-la-libre-el-congreso-dice-si/		"],
["Diputados del PRI, PAN, PRD y PVEM se opusieron a modificar Ley de Transparencia	","	Revolución 3.0	","	3/30/2016	","	http://revoluciontrespuntocero.com/diputados-del-pri-pan-prd-y-pvem-se-opusieron-a-modificar-ley-de-transparencia/		"],
["Pese a recortes presupuestales, diputados se aumentarán este año 96 mdp para grupos parlamentarios	","	Revolución 3.0	","	3/28/2016	","	http://revoluciontrespuntocero.com/pese-a-recortes-presupuestales-diputados-se-aumentaran-este-ano-96-mdp-para-grupos-parlamentarios/		"],
["Fernando Yunes pide a Segob mandar al ejército y Marina a Veracruz	","	Milenio	","	3/29/2016	","	http://www.milenio.com/politica/Fernando_Yunes_Veracruz-violencia_Veracruz-delitos_Veracruz-militares_Veracruz_0_709729243.html		"],
["El PAN denuncia al Lozoya Austin ante la ASF por posibles actos de corrupción en Pemex	","	Sin Embargo	","	3/30/2016	","	http://www.sinembargo.mx/30-03-2016/1642267		"],
["Esperan diputados que precriterios económicos para 2017 sean realistas y responsables	","	Noticias MVS	","	3/29/2016	","	http://www.noticiasmvs.com/#!/noticias/esperan-diputados-que-precriterios-economicos-para-2017-sean-realistas-y-responsables-345		"],
["La Reforma Energética estás hundiendo a México: Dolores Padierna	","	Al Momento	","	3/18/2016	","	http://www.almomento.mx/la-reforma-energetica-estas-hundiendo-a-mexico-dolores-padierna/		"],
["Condena Gil Zuarth actos terroristas en Bélgica	","	Al Momento	","	3/22/2016	","	http://www.almomento.mx/condena-gil-zuarth-actos-terroristas-en-belgica/		"],
["Buscan con reforma desincentivar el “turismo reproductivo”	","	Proceso	","	3/22/2016	","	http://www.proceso.com.mx/434448/buscan-reforma-desincentivar-turismo-reproductivo		"],
["Acusa Morena a adversarios de continuar con la práctica de la “compra del voto”	","	Proceso	","	3/30/2016	","	http://www.proceso.com.mx/435170/acusa-morena-a-adversarios-continuar-la-practica-la-compra-del-voto		"],
["Camacho: Padres de los 43 no pueden comparecer en San Lázaro	","	Milenio	","	3/30/2016	","	http://www.milenio.com/politica/caso_ayotzinapa-padres_normalistas-caso_iguala-padres_43_camara_de_diputados_0_710329198.html		"],
["Senado pide a PGR informe sobre desaparecidos	","	SDP Noticias	","	3/30/2016	","	http://www.sdpnoticias.com/nacional/2016/03/30/senado-pide-a-pgr-informe-sobre-desaparecidos		"],
["Alistan controversia contra nueva Ley de desaparición	","	SDP Noticias	","	3/29/2016	","	http://www.sdpnoticias.com/nacional/2016/03/29/alistan-controversia-contra-nueva-ley-de-desaparicion		"],
["PRI, PAN y PRD aprueban dictamen que le permite al Presidente anular garantías individuales	","	Vanguardia	","	3/30/2016	","	http://www.vanguardia.com.mx/articulo/pri-pan-y-prd-aprueban-dictamen-que-le-permite-al-presidente-anular-garantias-individuales		"],
["Cámara de Diputados gasta 229 mdp en puros vales	","	Sopitas	","	3/28/2016	","	http://www.sopitas.com/597905-camara-diputados-vales-229-mdp/		"],
["Diputados aprueban dictamen que permite estado de excepción	","	Sopitas	","	3/30/2016	","	http://www.sopitas.com/598617-estado-de-excepcion-mexico-reforma-diputados/		"],
["En extraordinario, resolución sobre desafuero de diputada	","	Milenio	","	3/28/2016	","	http://www.milenio.com/politica/diputada_ligada_Chapo-Lucero_Guadlaupe_Sanchez-desafuero_Lucero_Sanchez_0_709129273.html		"],
["PRI en el Senado propone reformar financiamiento a partidos políticos	","	Noticias MVS 	","	3/31/2016	","	http://www.noticiasmvs.com/#!/noticias/pri-en-el-senado-propone-reformar-financiamiento-a-partidos-politicos-255		"],
["Diputados se pronuncian por ampliación del #HoyNoCircula	","	W Radio	","	3/31/2016	","	http://wradio.com.mx/radio/2016/03/31/nacional/1459452664_401029.html		"],
["Diputados del PRI impiden proyección de documental que exhibe al Ejército en caso Iguala	","	Sin Embargo	","	3/31/2016	","	http://www.sinembargo.mx/31-03-2016/1642639		"],
["Como muestra de solidaridad, el PAN propone comprar autos eléctricos para diputados	","	SDP Noticias	","	3/31/2016	","	http://www.sdpnoticias.com/nacional/2016/03/31/como-muestra-de-solidaridad-el-pan-propone-comprar-autos-electricos-para-diputados		"],
["Senado prevé avalar en abril leyes secundarias anticorrupción	","	Terra	","	3/31/2016	","	http://noticias.terra.com.mx/mexico/politica/senado-preve-avalar-en-abril-leyes-secundarias-anticorrupcion,387e75b1d00cdd2c3a63a52378ecca4agupmjxlh.html		"],
["Senadores se pronuncian contra violencia sexual en Veracruz	","	E-Consulta	","	3/31/2016	","	http://e-veracruz.mx/nota/2016-03-31/nacion/senadores-se-pronuncian-contra-violencia-sexual-en-veracruz		"],
["Murillo Karam se reunirá en privado con diputados por caso Ayotzinapa	","	Sopitas	","	3/31/2016	","	http://www.sopitas.com/598955-murillo-karam-ayotzinapa-diputados-giei/		"],
["Diputados aprueban ampliar servicios de salud en todo el país	","	Terra	","	3/31/2016	","	http://noticias.terra.com.mx/mexico/politica/diputados-aprueban-ampliar-servicios-de-salud-en-todo-el-pais,c7a141afd78b22eb39870ee91f4be288ztqs80ux.html		"],
["Senadores aprueban reforma para regular reproducción asistida 	","	Quadratín 	","	3/31/2016	","	https://www.quadratin.com.mx/politica/Senadores-aprueban-reforma-regular-reproduccion-asistida/		"],
["Analizan acciones para detectar a tiempo los “cánceres invisibles” 	","	20 Minutos	","	3/31/2016	","	http://www.20minutos.com.mx/noticia/78955/0/analizan-acciones-para-detectar-a-tiempo-los-canceres-invisibles/		"],
["No se votarán leyes anticorrupción sin iniciativa #3de3, advierte el  PAN	","	El financiero	","	3/31/2016	","	http://www.elfinanciero.com.mx/nacional/no-se-votaran-leyes-anticorrupcion-sin-iniciativa-3de3-advierte-el-pan.html		"]
];
var bscore={}
var dipuvar=[];
var updatelist={};
orderednews={};
module.exports = module.export =
{
	news: function ( req, res, app, cb ){
		for (var i = 0; i < news_array.length; i++) {
			orderednews[news_array[i][3].trim() ]=news_array[i]
		}
		console.log("noticias")
		console.log("--")
		var c = new Crawler({
		    maxConnections : 100,
		    forceUTF8:true,		    
		    callback : function (error, result, $) {
		    	console.log("returned");
		    	allt=$('body').text();
				//console.log(allt);				//addinis(inis,app);
				for (var i = 0; i < dipuvar.length; i++) {
					//console.log(dipuvar[i].name);
					dipnames=dipuvar[i].name.trim().split(" ");
					reses=[];
					for (var j = 1; j < dipnames.length; j++) {
						
						search=dipnames[0]+" "+dipnames[j];
						//console.log(search);
						if (allt.indexOf(search) !== -1) {
							console.log("MATCH",dipuvar[i].name);
							if ( !updatelist[ dipuvar[i].id ] ) {
								updatelist[ dipuvar[i].id ] =[];
								updatelist[ dipuvar[i].id ].push({ url:result.uri , 
									title : orderednews[result.uri][0] ,
									date : orderednews[result.uri][2] , 
									medio : orderednews[result.uri][1]
								});

							}
							else{
								updatelist[ dipuvar[i].id ].push();
							}
							
						}
						
					}
					//updatelist[ dipuvar[i].id ] = reses
				}
				for (var key in updatelist) {
				  if (updatelist.hasOwnProperty(key)) {
				    app.models[ "diputados" ].update(  key , { newslist : updatelist[key] }, function (err,doc ){ 
			            console.log("err:"+err);
			            console.log("updated",doc[0].name,doc[0].newslist);
			            //res.end( JSON.stringify( doc ) );
			         });
				  }
				}
				

				console.log(updatelist);
		    }
		});
		app.models[ "diputados" ].find().exec(function (err, dips){
			  if (err) {
			    console.log(err);
			  }
			  else{
			  	dipuvar=dips;
			  	console.log('Number dips:',"senadores","Federal", dips.length);		
			  	for (var i = 0; i < news_array.length; i++) {
			  			  		console.log(news_array[i][3].trim() );
			  			  		c.queue( news_array[i][3].trim() );
			  	}		  	
			  	//c.queue('http://www.sopitas.com/598955-murillo-karam-ayotzinapa-diputados-giei/');
			  }
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
	checkok: function ( req, res, app, cb ){

		app.models[ "diputados" ].find().populate("work").exec(function createCB(err, trs){
			c_sidid=0;
			c_inis=0;
			for (var i = 0; i < trs.length; i++) {
				//console.log(trs.work);
				console.log( "inis" ,trs[i].work.length );
				if (trs[i].trayectoria) {
					//console.log( "trayectoria" ,trs[i].trayectoria.length );
				}
				else{
					console.log( "trayectoria" ,"none" );
				}
				
				if (trs[i].silid) {
					c_sidid+=1;
					//console.log(trs[i].name,trs[i].silid,trs[i].uriid);
				}
				else{
					console.log(trs[i].name,trs[i].silid,trs[i].uriid);
				}
				
			}
			console.log("senadores:",trs.length);
			console.log("sil:",c_sidid,"--")
		});
		
	},
	addips: function ( req, res, app, cb ){
		fs.readFile('crawler/alldips.json', 'utf8', function (err, data) {
		  if (err) throw err;
		  obj = JSON.parse(data);
		  // console.log(obj);
		  ddipp=obj.dip;
		  	async.forEachSeries(ddipp, function(sub, callback) { 
		        console.log(sub.name);
		        app.models[ "diputados" ].create(sub).exec(function createCB(err, created){
		            callback();
		        });
		        
		    }, function(err) {
		        console.log("DONE")
		    });
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

			// ranks.sort(function(a, b){return b-a});
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
				//console.log(bs);
		      	
		    }, function(err) {
		        console.log("DONE")
		    });
					

		});
	},
	addSocial: function ( req, res, app, cb ){
		partialMatcher( "jimena escribe con pedro" , {"112":{name:"Jimena"},"112":{name:"pablo"}} );
	}
}
function partialMatcher(match,list){
	for(name in list){
		subject=list[name];
		console.log(112,subject);
	}
}

