var Crawler = require("crawler");
var url = require('url');
var fs = require('fs');
var http = require('http-get');
var request = require('request');
var _ = require('lodash');
var async=require('async');
var Iconv  = require('iconv').Iconv;
var moment=require('moment');
var fs = require('fs');
var Levenshtein=require('levenshtein');
moment.locale('es');
var pdfText = require('pdf-text');


function nextdip(){
	getLast(app);
}

module.exports = module.export =
{

	asistenciaDip: function(req, res, app, cb){
		var pathToPdf = "pdfasist/asistencia_7abr16_5dias.pdf";
		dips=[];
		app.models[ "diputados" ].find({ select: ['name'] }).where( {camara : "diputados"} ).exec(function (errfind, found){
			dips=[];//found;
			for (var i = 0; i < found.length; i++) {
				permnameA=found[i].name.split(" ");
				permnameA.unshift(permnameA[permnameA.length-1]);
				permnameA.pop();
				permnameA.unshift(permnameA[permnameA.length-1]);
				permnameA.pop();
				permname=permnameA.join(" ");
				dips[ permname ]=found[i].id;
			}
            console.log(dips);
            pdfText(pathToPdf, function(err, chunks) {
				console.log(chunks.length);
				for (var i = 0; i < chunks.length; i++) {
					name=levPicker(chunks[i],dips);
					console.log("chunk",chunks[i],"name",name);
				}
				
			});
		});
		
		 ///index.php/esl/content/download/35119/176290/file/asistencia_04nov15_5dias.pdf
	},
	diputadosSIL: function( req, res, app, cb ){  //completa info de diputados desde el portal http://sil.gobernacion.gob.mx/
		var obj;
		fs.readFile('crawler/dips.json', 'utf8', function (err, data) {
		  if (err) throw err;
		  obj = JSON.parse(data);
		  test=[ ["9219077","9219077"] ];

		  	async.forEachSeries(obj, function(sub, callback) { 
		       subject=sub[1];
		       console.log(subject);
		       processDipSil(subject,"diputados",app,function( senador ){
					callback();
				});
		    }, function(err) {
		        res.end("DONE")
		    });
		});
	},
	senadoresSIL: function( req, res, app, cb ){  //completa info de senadores desde el portal http://sil.gobernacion.gob.mx/
		var obj;
		fs.readFile('crawler/sens.json', 'utf8', function (err, data) {
		  if (err) throw err;
		  obj = JSON.parse(data);
		  test=[ ["9219077","9219077"] ];

		  	async.forEachSeries(obj, function(sub, callback) { 
		       subject=sub[1];
		       console.log(subject);
		       processDipSil(subject,"senadores",app,function( senador ){
					callback();
				});
		    }, function(err) {
		        res.end("DONE")
		    });
		});
	},
	diputados: function ( req, res, app, cb ){ //CREA info de diputados desde http://sitl.diputados.gob.mx
		var links=[];
		var c = new Crawler({
		    maxConnections : 100,
		    forceUTF8:true,		    
		    callback : function (error, result, $) {
		    	title=$("title").text();
		        console.log("title:",title);
		        num=0;
		        dipobject={};
		        $('a').each(function(index, datos) {
		        	link=$(datos).attr("href");
		        	if (link.indexOf("curricula")>-1) {

		        		console.log("http://sitl.diputados.gob.mx/LXIII_leg/"+link);
		        		links.push("http://sitl.diputados.gob.mx/LXIII_leg/"+link);
		        		processDip("http://sitl.diputados.gob.mx/LXIII_leg/curricula.php?dipt=260",res,app);
		        		num+=1;
		        	}
		        	console.log(num,link);
		        });
		        //processDip(links,app);
		    }
		});
		c.queue('http://sitl.diputados.gob.mx/LXIII_leg/listado_diputados_buscador.php');
		//processDip('http://sitl.diputados.gob.mx/LXIII_leg/curricula.php?dipt=260',res);
	},
	senadores2: function (req, res, app, cb ){ //CREA info de diputados desde http://www.senado.gob.mx/
		console.log("sen2");
		//Lista de id's de senado
		var list=["636"
				, "543"
				, "630"
				, "712"
				, "542"
				, "522"
				, "602"
				, "619"
				, "743"
				, "725"
				, "629"
				, "618"
				, "518"
				, "634"
				, "578"
				, "517"
				, "575"
				, "587"
				, "675"
				, "535"
				, "555"
				, "583"
				, "603"
				, "689"
				, "601"
				, "628"
				, "653"
				, "760"
				, "660"
				, "714"
				, "637"
				, "613"
				, "538"
				, "609"
				, "560"
				, "594"
				, "638"
				, "551"
				, "606"
				, "534"
				, "612"
				, "554"
				, "582"
				, "697"
				, "620"
				, "516"
				, "544"
				, "531"
				, "702"
				, "562"
				, "513"
				, "643"
				, "563"
				, "753"
				, "624"
				, "617"
				, "586"
				, "665"
				, "545"
				, "666"
				, "526"
				, "621"
				, "608"
				, "607"
				, "577"
				, "519"
				, "658"
				, "566"
				, "550"
				, "635"
				, "616"
				, "524"
				, "584"
				, "572"
				, "700"
				, "537"
				, "561"
				, "589"
				, "590"
				, "674"
				, "533"
				, "642"
				, "579"
				, "639"
				, "670"
				, "539"
				, "565"
				, "703"
				, "581"
				, "548"
				, "657"
				, "574"
				, "600"
				, "598"
				, "632"
				, "558"
				, "580"
				, "569"
				, "564"
				, "521"
				, "532"
				, "724"
				, "604"
				, "611"
				, "553"
				, "530"
				, "552"
				, "536"
				, "693"
				, "615"
				, "659"
				, "529"
				, "625"
				, "549"
				, "568"
				, "514"
				, "523"
				, "515"
				, "525"
				, "527"
				, "571"
				, "610"
				, "623"
				, "631"
				, "622"
				, "640"
				, "559"];
				/*
					el contador va hasta cincuenta para no saturar la página de senadores
				*/
				for (var i = 0; i < 50; i++){//list.length; i++) { 
					subject=list[i];

					processSen(subject,app,function( senador ){
						app.models[ "diputados" ].find({name:senador.name}).exec(function (err, usersNamedFinn){
							  if ("err",err) {
							    console.log(err);
							  }
							  if (usersNamedFinn.length==0) {
							  	app.models[ "diputados" ].create(senador).exec(function createCB(err, created){
						            console.log("errcreating:",err);
						            console.log("body",created);
						            res.end( JSON.stringify( [ 1 , created] )  );
						        });
							  }
							  else{
							  	console.log("existed",senador.name);
							  	res.end( JSON.stringify( [0,"existed"] ) );
							  }
						  	
						});
						
					});
				};
				
	},
	senadores: function ( req, res, app, cb ){ // CREA senadores desde página de orden alfabético en http://www.senado.gob.mx/
		listlinks=[];
		alf=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","X","Y","Z"] 
		var c = new Crawler({
		    maxConnections : 100,
		    forceUTF8:true,		    
		    callback : function (error, result, $) {
		    	uri=result.uri;
		    	tablegen=$('table[width="950"]');
		        num=1;
		        dipobject={};
		        tablegen.find('font[color="#ffffff"]').each(function(index, datos) {
		        	link=$(datos).closest('a').attr("href");
		        	if (link) {
		        		listlinks.push(link);
		        		console.log(",",'"http://www.senado.gob.mx/'+link+'"');
		        	}

		        	
		        });
		    }
		});
		for (var i = 0; i < alf.length; i++) {
			c.queue('http://www.senado.gob.mx/index.php?ver=int&mn=4&sm=1&str='+alf[i]);
		};
	},
	trabajoAuto: function ( req, res, app, cb ){ // Adquiere trabajo legislativo completo
		getLast(app,function (last){
			console.log(last);
		});
		
	},
	pas: function ( req, res, app, cb ){ // Adquiere trabajo legislativo completo
		console.log("puntos de acuerdo")
		console.log("P A's")
		var c = new Crawler({
		    maxConnections : 100,
		    forceUTF8:true,		    
		    callback : function (error, result, $) {
		    	app.models[ "diputados" ].find().exec(function (err, dips){
					  if (err) {
					    console.log(err);
					  }
					  else{
					  	console.log('Number dips:',"todos","Federal", dips.length);
				    	inis=[];
				    	console.log("--");
				    	tablegen=$('table[width="1000px"]');
				        num=0;
				        dipobject={};
				        tablegen.find('tr').each(function(index, datos) {
				        	console.log("-------->");
				        	ini={};
				        	tds=$(datos).find('td');

				        	$(datos).find('td').each(function(index2,datos2){
				        	 	test8859=$(datos2).text();
				        	 	/*
									Hay qie arreglar codificación aquí !!!
				        	 	*/

								var test = test8859;//decodeURIComponent(unescape(test8859)); 
				        	 	switch(index2) { // Cada índice corresponde a un tag td
								    case 1:
								        ini.type="pa";
								        if (test=="Iniciativa") {ini.type="i"}
								        break;
								    case 2:
								    	linkcomplete=$(datos2).find("a").attr("onclick");
								    	
								    	if (linkcomplete && linkcomplete.length>2) {
								    		chunks=linkcomplete.split('"');
								        	ini.link="http://sil.gobernacion.gob.mx/"+chunks[1];

								    	}
								        ini.resumen=test;
								        break;
								    case 3:
								        ini.subtype=test;
								        break;
								    case 4:
								        ini.origen=test;
								        if (test.indexOf("Diputados") > -1) {ini.camara="diputados";}
								        else if (test.indexOf("Senadores") > -1) {ini.camara="senadores";}
								        break;
								    case 5:
								        ini.presentacion=test;
								        break;
								    case 6:
								    	autores=[];
								    	$(datos).find('a').each(function(index3,datos3){
								    		
								    		autor={};//$(datos3).text();
								    	    linkau=$(datos3).attr("onclick");

								    		m_linkau2=linkau.split("SID=");
								    		if (m_linkau2[1]) {
								    			m_referencia=m_linkau2[1].split('&');
								    			autor.id=m_referencia[0];
								    			//autores.push(m_referencia[0]);
								    		}

								    		linkau2=linkau.split("Referencia=");
								    		if (linkau2[1]) {
								    			referencia=linkau2[1].split('"');
								    			autor.ref=referencia[0];
								    			//autores.push(referencia[0]);
								    		}
								    		autor.text=$(datos3).text();
								    		autores.push(autor);
								    		
								    	});
								        ini.autor=autores;
								        console.log("autores-ref",ini.autores);
								        break;
								    case 7:
								        ini.partido=test;
								        break;
								    case 8:
								        ini.legislatura=test.trim(); //LXIII

								        break;
								    case 9:
								        ini.turnado=test;
								        break;
								    case 10:
								        ini.estado=test;
								        break;
								    case 11:
								        ini.tema=test;
								        break;
								}

				        	})
								ini.ordenDeGobierno="Federal";
								app.models[ "trabajo" ].find({resumen:ini.resumen}).exec(function (err, usersNamedFinn){
								  if ("err",err) {
								    console.log(err);
								  }
								  if (ini.legislatura && ini.legislatura.length() > 2) {
								  	app.models[ "trabajo" ].create(ini).exec(function createCB(err, created){
							            console.log("errcreating:",err);
							            console.log("body",created);
							        });
								  }
								  else{
								  	console.log("existed",ini.resumen);
								  }
								  
								});
				        		inis.push(ini);
				        		addinis2(ini,dips,app,function(err){
				        			console.log("dd->"+err);
				        		});
				        		
				        		
							
				        });
						console.log(inis);
					  }
				});

		    	
		    }
		});

		////// Estos links cambian diario así que hay que administralrlos de forma manual !!!

		//DIP
		// for (var i = 1; i <= 21; i++) {  //xiii inis all
		// 	c.queue('http://sil.gobernacion.gob.mx/Busquedas/Avanzada/ResultadosBusquedaAvanzada.php?SID=503462fb2828e5826c2fbac1fde43505&Origen=BA&Serial=69e4892e6ee56b68c5f19ccf41481179&Reg=2098&Paginas=100&pagina='+i); //4
		// }
		// for (var i = 1; i <= 35; i++) {  //xiii pas all
		// 	c.queue('http://sil.gobernacion.gob.mx/Busquedas/Avanzada/ResultadosBusquedaAvanzada.php?SID=503462fb2828e5826c2fbac1fde43505&Origen=BA&Serial=f04a28fb0ffaaf88481699b8caee39e7&Reg=3427&Paginas=100&pagina='+i); //4
		// }
		////SEN
		// for (var i = 1; i <= 19; i++) {  //xii senadores inis
		// 	c.queue('http://sil.gobernacion.gob.mx/Busquedas/Avanzada/ResultadosBusquedaAvanzada.php?SID=503462fb2828e5826c2fbac1fde43505&Origen=BA&Serial=4d2c522a63ad26e96281578d872172c7&Reg=1870&Paginas=100&pagina='+i); //4
		// }
		for (var i = 1; i <= 29; i++) {  //xii senadores pas
			c.queue('http://sil.gobernacion.gob.mx/Busquedas/Avanzada/ResultadosBusquedaAvanzada.php?SID=503462fb2828e5826c2fbac1fde43505&Origen=BA&Serial=6d4f0eb987789085d3472eee18568797&Reg=2824&Paginas=100&pagina='+i); //4
		}
		
	},
	dipAsist: function( req, res, app, cb ){
		var dips={};
		var c = new Crawler({
		    maxConnections : 100,
		    forceUTF8:true,
		    callback : function (error, result, $) {
		    	
		    	$('a').each(function(index, elem) {
		    		link=$(elem).attr("href");
		    		console.log(link);
		    		d.queue("http://gaceta.diputados.gob.mx"+link);
		    	});
		    }
		});
		var d = new Crawler({
		    maxConnections : 100,
		    forceUTF8:true,
		    callback : function (error, result, $) {
		    	uri=result.uri;
		    	parts=uri.split("/L");
		    	patss=parts[1].split(".");
		    	console.log(patss[0][0]+patss[0][1]+"/"+patss[0][2]+patss[0][3]+"/20"+patss[0][4]+patss[0][5])
		    	fechaasist=patss[0][0]+patss[0][1]+"/"+patss[0][2]+patss[0][3]+"/20"+patss[0][4]+patss[0][5];
		    	$('tr').each(function(index, elem) {
		    		

		    		asis=$(elem).text();
		    		nametm=$(elem).find("td").eq(0).text();
		    		inasisttm=$(elem).find("td").eq(1).text();
		    		nametm=nametm.split(" ");
		    		namecomp="";
		    		for (var i = 1; i < nametm.length; i++) {
		    			namecomp=namecomp+" "+nametm[i];
		    		};
		    		namecomp=namecomp.trim();
		    		if (inasisttm.indexOf("INASISTENCIA")>-1) {
		    			console.log("-->>","-"+namecomp+"-",inasisttm);
		    		}
		    		
		    	});
		    	
		    }
		});
		c.queue("http://gaceta.diputados.gob.mx/gp62_Asis3.html");
		app.models[ "diputados" ].find({ camara:"diputados" , ordenDeGobierno: "Federal" }).exec(function (err, dips){
			if (err) {
			    console.log(err);
			}
			else{
				console.log('Number dips:',"diputados","Federal", dips.length);
			  	c.queue("http://gaceta.diputados.gob.mx/gp62_Asis3.html");
			}
			for (var i = 0; i < dips.length; i++) {
				console.log('[ '+dips[i].id+' ,"'+dips[i].name+'"]')
			};
		});
	},
	debatedips: function ( req, res, app, cb ){
		var idsdeb = JSON.parse(fs.readFileSync('crawler/debatedips.json', 'utf8'));
		app.models[ "diputados" ].find({ 
			select: ['id','name'],
			where:  { camara : "diputados" , debateUpdated: {$exists: false} },
		}).exec(function (errfind, found){
			dips=found;
			ndips={};
			for(dip in dips){
				ndips[dips[dip].name]=dips[dip].id;
			}
			console.log(ndips);
			async.forEachSeries(idsdeb, function(subject, callback) { 
		       	processdebate(subject[1], function(num){
		       			console.log(subject,num);
		       			chunks=subject[0].split(" ");
		       			np="";
		       			for (var i = 0; i < chunks.length-1; i++) {
		       				np+=chunks[i]+" ";
		       			}
		       			np+=chunks[chunks.length-1]+" "+np;
		       			
		       			
		       			resv=levPicker(np,ndips);
		       			iddip=ndips[resv[0]];
		       			debateArr=[];
		       			for(i=0;i<num;i++){
		       				debateArr[i]="_";
		       			}
		       			console.log("y--->",resv,resv[0],iddip,ndips[resv[0]]);
		       			if (name!="null") {
		       				app.models[ "diputados" ].update({name:resv[0]},{debate:debateArr,debateUpdated:1}).exec(function afterwards(err, updated){//{trayectoria:dip.trayectoria , silid:dip.uriid}).exec(function afterwards(err, updated){
							  	console.log('Updated',updated);	
							  	callback();
							});
		       			}else{
		       				callback();
		       			}
		       			
		       			
		       	});
		       

		    }, function(err) {
		        res.end("DONE")
		    });
				
		});
		////////////
		

		// for (name in idsdeb) {
		// 	console.log( idsdeb[name] );
		// }
	}
}

//FUNCIONES DE APOYO PARA EL MÓDULO
function getLast(app,next){
	app.models[ "trabajo" ].find({}).sort({presentacion:-1}).limit(100).exec(function (err, result){
		for(x in result){
			console.log(x.presentacion);
		}
		next(result[0].presentacion);
	});
}
function processdebate(id,done){
	var c = new Crawler({
		forceUTF8:true,
	    maxConnections : 100,
	    callback : function (error, result, $) {
		    	uri=result.uri;
		    	body=result.body
		    	b2=body.split('hits="');
		    	b3=b2[1].split('"');

		    	console.log("número",b3[0]);
		    	done(b3[0]);
		    	
		    }
	});
	c.queue('http://cronica.diputados.gob.mx:8080/exist/siid2/siid2.xql?legis=LXIII&coleccion="/db/LXIII/A1/P1/Ord" ,"/db/LXIII/A1/P1/CPerma" ,"/db/LXIII/A1/P2/Ord" &qu=xquery version "1.0" encoding "iso-8859-1"; for $i at $pos in collection("/db/LXIII/A1/P1/Ord" ,"/db/LXIII/A1/P1/CPerma" ,"/db/LXIII/A1/P2/Ord" )//Tema//Intervencion[@modalidad],  $dip in $i/(B|b)/diputado[1] where $dip[@modalidad ne "DLS"] and $dip[@modalidad ne "AA"] and $dip[@modalidad ne ""] and $dip[@modalidad and @id eq "'+id+'"] order by $i/root()/DiarioDeDebates/attribute(fecha),$i/root()/DiarioDeDebates/@numero  return if (exists($i/ancestor::Tema/Versales)) then <Intervencion><Fecha>{$i/ancestor::DiarioDeDebates/attribute(*)}</Fecha> <asunto> {attribute legis {$i/root()/DiarioDeDebates/@legislatura}} {attribute coleccion {\'/db/LXIII/A1/P1/Ord ,/db/LXIII/A1/P1/CPerma ,/db/LXIII/A1/P2/Ord \'}} {attribute id {$dip/attribute(id)}} {attribute fecha {$i/ancestor::DiarioDeDebates/attribute(fecha)}} {attribute num {$pos}} {$i/ancestor::Tema/Versales/text()}</asunto> </Intervencion>else <Intervencion><Fecha>{$i/ancestor::DiarioDeDebates/attribute(*)}</Fecha> <asunto> {attribute legis {$i/root()/DiarioDeDebates/@legislatura}} {attribute coleccion {\'/db/LXIII/A1/P1/Ord ,/db/LXIII/A1/P1/CPerma ,/db/LXIII/A1/P2/Ord \'}} {attribute id {$dip/attribute(id)}} {attribute fecha {$i/ancestor::DiarioDeDebates/attribute(fecha)}} {attribute num {$pos}} {$i/ancestor::Tema/text()}</asunto> </Intervencion>&_=');

}

function addinis2(ini,dips,app,done){ // SIL
	app.models[ "trabajo" ].create(ini).exec(function createCB(err, created){
	  		if(!err && created.autor){
	  			for (var i = 0; i < dips.length; i++) {
		  			name=dips[i].name.toLowerCase();
        			autor=created.autores;
					if (autores.length >=1 ) {
						
						// app.models[ "diputados" ].find({id:dips[i].id}).exec(function(e,r){
						//   r[0].work.add(created.id);
						//   r[0].save(function(err,res){
						//     console.log("link saved",res);
						//   });
						// });

						//console.log("linkin",name,autor);
					}
        		}
	            console.log("errcreating:",err);
	            console.log("body",created);
	            done(null);
	  		}
	  		else{
	  			done(null);
	  		}
	  		
            
        });
}

function processDip(list,app){
	
	var c = new Crawler({
	    maxConnections : 100,
	    forceUTF8:true,
	    callback : function (error, result, $) {
	    	comarr=[];
	    	dip={};
	    	table=$('table[width="94%"]');
	    	img="http://sitl.diputados.gob.mx/LXIII_leg/"+table.find("img").attr("src");
	    	//img.replace("./","http://sitl.diputados.gob.mx/LXIII_leg/");
	    	dip.imageurl=img;//table.find("img").attr("src");
	    	infotable=$('table[width="500"]');
	    	//dip.comisiones={};
	    	comtable=$('table[width="760"]:nth-child(1)');
	    	comtable.find("tr:nth-child(2)").find("a").each(function(index, datos) {
	    		com={};
	    		ll=$(datos).text();
	    		if (ll.indexOf("(S") > -1) {com.puestocom="secretaría";}
	    		else if (ll.indexOf("(") > -1) {com.puestocom="presidente"}
	    		else{
	    			com.puestocom="miembro"
	    		}
	    		ll=ll.replace(' (Secretaría)',"");
	    		ll=ll.replace(' (Presidente)',"");
	    		ll=cleanText(ll);
	    		com.namecom=ll;
	    		com.linkcom=$(datos).attr("href");
	    		comarr.push(com);
	    		
	    	});
	    	dip.comisiones=comarr;
	    	partyimg=$('img[width="80"]').attr("src");

	    	if (partyimg.indexOf("pri")>-1) {dip.party="pri"}
	    	if (partyimg.indexOf("pan")>-1) {dip.party="pan"}
	    	if (partyimg.indexOf("prd")>-1) {dip.party="prd"}
			if (partyimg.indexOf("vrd")>-1) {dip.party="pvem"}
	    	if (partyimg.indexOf("Morena")>-1) {dip.party="morena"}
	    	if (partyimg.indexOf("movimiento")>-1) {dip.party="mc"}
	    	if (partyimg.indexOf("encuentro")>-1) {dip.party="encuentro"}
	    	if (partyimg.indexOf("panal")>-1) {dip.party="panal"}
	    	if (partyimg.indexOf("independiente")>-1) {dip.party="independiente"}
	    	dip.name=cleanText(infotable.find('td[height="23"]').find("strong").text());
	    	dip.ordenDeGobierno="Federal";
	    	dip.camara="diputados";
	    	infotable.find('td[width="470"]').each(function(index, datos) {
	          if (index==0) {
	          	if ($(datos).text().indexOf("elativa") > -1) {dip.eleccion="MR"}
	          	else if($(datos).text().indexOf("proporcional") > -1){dip.eleccion="RP"}
	          }
	      	  if (index==1) {
	      	  	alinfo=$(datos).text().split("|");
	      	  	dip.estado=alinfo[0].trim();
	      	  	circ=alinfo[1].split(":");
	          	if (circ[0].trim().indexOf("ircuns") > -1) {dip.circunscripcion=circ[1].trim();}
	          	else if(circ[0].trim().indexOf("istri") > -1){dip.distrito=circ[1].trim();}
	          }
	      	  if (index==2) {
	          	dip.mail=$(datos).text();
	          }
	        });
	    	tablehtml=table.html();
	    	
	    	app.models[ "diputados" ].find({name:dip.name}).exec(function (err, usersNamedFinn){
			  if ("err",err) {
			    console.log(err);
			  }
			  if (usersNamedFinn.length==0) {
			  	app.models[ "diputados" ].create(dip).exec(function createCB(err, created){
		            console.log("errcreating:",err);
		            console.log("body",created);
		        });
			  }
			  else{
			  	console.log("existed",dip.name);
			  }
			  
			});

	    }
	});
	for (var i = 0; i < list.length; i++) {
		c.queue(list[i]);
	}
	//c.queue(link);
}
function processSen(subject,app,done){
	console.log("senadores2");
	 async.series([
        function(next){
            var c = new Crawler({
			    maxConnections : 100,
			    forceUTF8:true,
			    callback : function (error, result, $) {
			    	uri=result.uri;
			    	id=uri.split("id=")[1];
			    	dip={};
			    	dip.uriid=id;
			    	dip.name=cleanText($('.nombre_senador').text() );
			    	partyimg=$('.imagen_fraccion').find("img").attr("src");
			    	dip.party=$('.imagen_fraccion').find("img").attr("src");
			    	dip.estado=$('.estado').text().replace("Por el estado de ","").toLowerCase();
			    	dip.imageurl='http://www.senado.gob.mx/'+$(".foto_senador").find("img").attr("src");
			    	representacion=$(".redes_sociales").text();
			    	dip.ordenDeGobierno="Federal";
			    	dip.camara="senadores";
			    	comisiones=$('td[rowspan="2"]');
			    	comarr=[];
			    	comisiones.find("a").each(function(index, datos) {
			    		com={};
			    		ll=$(datos).text();
			    		if (ll.indexOf("(S") > -1) {com.puestocom="secretaría";}
			    		else if (ll.indexOf("(") > -1) {com.puestocom="presidente"}
			    		else{
			    			com.puestocom="miembro"
			    		}
			    		ll=ll.replace('COMISIÓN DE ',"");
			    		//ll=ll.replace(' (Presidente)',"");
			    		ll=cleanText(ll);
			    		com.namecom=ll;
			    		puesto=$(datos).parent("div").find("strong").text();
			    		if (puesto.indexOf("SECRETA")>-1) {
			    			com.puestocom="secretaría";
			    		}
			    		else if(puesto.indexOf("PRESID")>-1 ){
			    			com.puestocom="presidente";
			    		}
			    		else{
			    			com.puestocom="miembro";
			    		}
			    		com.linkcom=$(datos).attr("href");
			    		if (com.linkcom.indexOf("index.php")>-1) {
			    			comarr.push(com);
			    		}
			    		//comarr.push(com);
			    		
			    	});
			    	dip.comisiones=comarr;
			    	//PRIMERA MINORÍA Lista Nacional MAYORÍA RELATIVA
			    	if (representacion.indexOf("RIMERA MINOR")>-1) {dip.eleccion="PM"}
			    	if (representacion.indexOf("Lista Nacional")>-1) {dip.eleccion="RP"}
			    	if (representacion.indexOf("A RELATIVA")>-1) {dip.eleccion="MR"}
			    	if (partyimg) {
			    	if (partyimg.indexOf("pri.")>-1) {dip.party="pri"}
			    	if (partyimg.indexOf("pan.")>-1) {dip.party="pan"}
			    	if (partyimg.indexOf("prd.")>-1) {dip.party="prd"}
			    	if (partyimg.indexOf("pt.")>-1) {dip.party="pt"}
					if (partyimg.indexOf("pvem.")>-1) {dip.party="pvem"}
			    	if (partyimg.indexOf("Morena")>-1) {dip.party="morena"}
			    	if (partyimg.indexOf("movimiento")>-1) {dip.party="mc"}
			    	if (partyimg.indexOf("encuentro")>-1) {dip.party="encuentro"}
			    	if (partyimg.indexOf("alianza.")>-1) {dip.party="panal"}
			    	if (partyimg.indexOf("independiente")>-1) {dip.party="independiente"}
			    	}
			    	
			    	
			    	//console.log(dip);
			    	next(null,dip);
			    }
			});
			////////////
			c.queue("http://www.senado.gob.mx/index.php?ver=int&mn=4&sm=6&id="+subject);
			
        },
        function(next){
        	var d = new Crawler({
			    maxConnections : 100,
			    forceUTF8:true,
			    callback : function (error, result, $) {
			    	console.log("aaaa");
			    	sesiones=$('table[width="90%"]');
			    	var asist={};
			    	flag=0;
			    	dia={};
			    	fecha="";
			    	sesiones.find("td").each(function(index, datos) {
			    		te=$(datos).text();
			    		if (flag==1) { // es fecha
			    			nums=te.split(" de ");
			    			moment.locale('es');
			    			nums2=nums[0].split(" ");
			    			var day = moment(nums2[1]+"/"+nums[1]+"/"+nums[2],"DD/MMM/YYYY");
			    			flag=2;	
			    			fecha=day;
			    			dia[day]="-";
			    		}
			    		else if (flag==2) { //es texto
			    			flag=0;
			    			dia[fecha]=te;
			    		}
			    		if ( Number.isInteger(parseInt(te)) ) {
			    			flag=1;

			    		}
			    	});
			    	//console.log(dia);
			    	next(null,dia);
			    }
			});
			////////////
			d.queue("http://www.senado.gob.mx/index.php?ver=sen&mn=7&sm=3&id="+subject);
        },
        function(next){   //DEBATE
        	var e = new Crawler({
			    maxConnections : 100,
			    forceUTF8:true,
			    callback : function (error, result, $) {
			    	tot={}
			    	interv=$('table[cellspacing="0"]');
			    	inter={};
			    	intercomp=[];
			    	$('table[cellspacing="0"]').each(function(index, datos) {
			    		link=$(datos).find("a").attr("href")
			    		tt=$(datos).text();
			    		fecha=$(datos).find("strong").last().text();			    		
			    		nums=fecha.split(" de ");
			    		moment.locale('es');
			    		nums2=nums[0].split(" ");

			    		var day = moment(nums2[1]+"/"+nums[1]+"/"+nums[2],"DD/MMM/YYYY");
			    		if (tt.indexOf("Intervención")>-1) {
			    			intercomp.push({ desc:cleanText(tt) , date: day.toString() , link:link });
			    			if (inter[day.toString()]) {inter[day.toString()]+=1;}
			    			else{inter[day.toString()]=1}
			    		}
			    	});
			    	tot.debate=inter;
			    	tot.completo=intercomp;
			    	next(null,tot);
			    }
			});
			/////////////
			e.queue("http://www.senado.gob.mx/index.php?ver=int&mn=4&sm=27&id="+subject);
        }
    ],function(err, results){
    	senador=results[0];
    	senador.asistencia=results[1];
    	senador.debate=results[2].debate;
    	senador.debatelist=results[2].completo;
    	done(senador);
	});

	
}
function processDipSil(subject,camara,app,done){
	console.log("processing:",subject);
	var without={};
	 async.series([
        function(next){
            var c = new Crawler({
            	forceUTF8:true,
			    maxConnections : 100,
			    callback : function (error, result, $) {
			    	uri=result.uri;

			    	id=uri.split("Referencia=")[1];
			    	dip={};
			    	dip.uriid=id;
			    	$('table[border="1"]').eq(0).find(".tdcriterio").each(function(index, elem) {
			    		cat=$(elem).text();
			    		valelem=$(elem).parent("tr").find(".tddatosazul");
			    		val=$(elem).parent("tr").find(".tddatosazul").text();
			    		
			    		if (cat.indexOf("Nombre")>-1) { // name
			    			val=$(elem).parent("tr").find(".tddatosazul").text();//.find("b").text();
			    			vals=val.split(", ");
			    			
			    			dip["name"]=vals[1]+" "+vals[0];
			    		}
			    		else if (cat.indexOf("Partido")>-1) { // name
			    			dip["party"]=val;
			    		}
			    		else if (cat.indexOf("Nacimiento")>-1) { // name
			    			ages=val.split("Fecha: ");
			    			if (ages[1]) {
			    				ages2=ages[1].split('Entidad');
			    				ages3=ages2[0];
			    			}
			    			dip["age"]=ages3;
			    			console.log("nacimiento",ages3);
			    		}
			    		else if (cat.indexOf("Correo")>-1) { // name
			    			dip["mail"]=val;
			    		}
			    		else if (cat.indexOf("Zona")>-1) { // name
			    			val=$(elem).parent("tr").find(".tddatosazul").html();
			    			vals=val.split("<br>")
			    			vals2=vals[0].split("Entidad: ")
			    			dip["estado"]=vals2[1];
			    		}
			    		else if (cat.indexOf("Principio de")>-1) { // name
			    			if (val.indexOf("Relativa")>-1) {
			    				val="MR";
			    			}
			    			else if (val.indexOf("Minor")>-1) {
			    				val="PM";
			    			}
			    			else if (val.indexOf("Proporcional")>-1) {
			    				val="RP";
			    			}
			    			dip["eleccion"]=val;
			    		}

			    		console.log("->>",cat,"->>",val);
			    	});
					num=0;
					tit="";
					dip["comisiones"]=[]
					$("img").each(function(index,elem) {
						src=$(elem).attr("src");
						
					});
					$('table[border="1"]').eq(1).find("tr").each(function(index, elem) {
						if(num==0){
							tit=$(elem).find("td").eq(0).text();
						}
						else{
							if(tit=="Comisión"){
								all=$(elem).text();
					    		//console.log("-_-"+ all)

					    		puesto=cleanText( $(elem).find("td").eq(1).text() );
					    		comision=cleanText( $(elem).find("td").eq(0).text() );
					    		comision=comision.replace(" (C. Diputados)","");
					    		dip["comisiones"].push({puestocom:puesto , namecom: comision });
							}
						}
						num+=1;
						
			    	});
			    	num=0;
			    	tit="";
			    	dip["trayectoria"]=[];
			    	already={};
			    	$('table[width="100%"]').each(function(index, elem) {

			    			rub="";
			    			if (index==0) {rub="administrativa";}
			    			if (index==1) {rub="política";}
			    			if (index==2) {rub="académica";}
			    			if (index==3) {rub="empresarial";}
			    			if (index==3) {rub="otros";}
			    			
							tit=$(elem).find("td").eq(0).text();
							trabajo="";
							if(tit=="Del año"){

								$(elem).find("tr").each(function(index2, elem2) {
								
									starts=$(elem2).find(".tddatosazul").eq(0).text();
									ends=$(elem2).find(".tddatosazul").eq(1).text();
									trabajo=$(elem2).find(".tddatosazul").eq(2).text();
									if(trabajo.length>2 && !already[trabajo]){ 
										already[trabajo]=1;
										dip["trayectoria"].push({ de:starts, a:ends , descripcion: trabajo }); 
									}
									
								});


							}
						num+=1;
			    	});
			    	dip["imageurl"]=$('img[alt="Foto del Legislador"]').attr("src");
			    	dip["linksil"]=uri;
					dip["ordenDeGobierno"]="Federal";
					dip["camara"]=camara;
					dip["silid"]=id;
			    	app.models[ "diputados" ].find({silid:dip.silid}).exec(function (err, usersNamedFinn){
						  if ("err",err) {

						    console.log(err);
						  }
						  if (usersNamedFinn.length==0) {
						  	console.log("nonexistent",dip.name,"<-")
						  	next(null,dip);
						  	// app.models[ "diputados" ].create(dip).exec(function createCB(err, created){
					    //         console.log("errcreating:",err);
					    //         console.log("created",created.name);
					    //         //console.log(dip);
			    		// 		next(null,dip);
					    //     });
						  }
						  else{
						  	console.log("tr:"+dip.trayectoria.length);
						  	if(dip.trayectoria.length==0){
						  		without[dip.uriid]=">"+dip.name+"<";
						  		console.log("wo:",without)
						  	}
						  	app.models[ "diputados" ].update({silid:dip.silid},{age:dip.age, mail:dip.mail}).exec(function afterwards(err, updated){//{trayectoria:dip.trayectoria , silid:dip.uriid}).exec(function afterwards(err, updated){
							  	console.log("existed",dip.name);
						  		next(null,dip);
							  	console.log('Updated user to have age ',updated[0].age);
							});
						  	
						  }
					  	
					});

			    	
			    }
			});
			////////////
			c.queue("http://sil.gobernacion.gob.mx/Librerias/pp_PerfilLegislador.php?SID=&Referencia="+subject);
			
        },
        function(next){
        	next(null,"dip");
        },
        function(next){   //DEBATE
        	next(null,"dip2");

        }
    ],function(err, results){
    	console.log("done processing:",subject);
    	// senador=results[0];
    	// senador.asistencia=results[1];
    	// senador.debate=results[2].debate;
    	// senador.debatelist=results[2].completo;
    	done(results);
	});

	
}
function cleanText(txt){
    txt=txt.trim();
    txt=txt.replace("Sen. ", "");
    txt=txt.replace("Dip. ", "");
    txt=txt.replace("\r", "");
    txt=txt.replace("\n", "");
    txt.replace("\t", "");
    txt.replace(" (C. Diputados)", "");
    txt=txt.trim();
    return txt;
}
function removeTags(txt){
    var rex = /(<([^>]+)>)/ig;
    return txt.replace(rex , "");
}
function processAsistDip(list){

}
function lettermatch(str1,str2){
	m=0;
	for (var i = 0; i < str1.length; i++) {
		if( str1[i]==str2[i] ){
			m+=1;
		}
		
	}
	return m/str1.length;
}

function levPicker(str,obj){ //cicla un array para obtener el mejor match (levenshtein) en el
	max=100;
	maxname="none";
	console.log(str);
	for (name in obj) {
		if (str && str.length>0 && name && name.length>0) {
			ratio=levMatcher( standard(str) , standard(name) );
			if (ratio<max && ratio<20) {
				// console.log(standard(str) , standard(name) , ratio)
				max=ratio;
				maxname=name;
				console.log(maxname +"--"+ str );
			}
		}
		
	}

	return [standard(maxname),max ];
}
function levMatcher(st1,st2){ //implementción de comparación de levenshtein
	var dl=new Levenshtein( st1, st2 );
	return dl.distance;
}
function standard(str){
		str=str.toLowerCase();
		str=str.trim();
		return str;
}
