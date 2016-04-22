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
var fs = require('fs');
moment.locale('es');

function nextdip(){

}

module.exports = module.export =
{
	diputadosSIL: function( req, res, app, cb ){
		var obj;
		fs.readFile('crawler/dips.json', 'utf8', function (err, data) {
		  if (err) throw err;
		  obj = JSON.parse(data);
		  test=[ ["9219077","9219077"] ];

		  	async.forEachSeries(test, function(sub, callback) { 
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
	senadoresSIL: function( req, res, app, cb ){
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
	diputados: function ( req, res, app, cb ){
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
		        		processDip("http://sitl.diputados.gob.mx/LXIII_leg/curricula.php?dipt=260",res,app)//"http://sitl.diputados.gob.mx/LXIII_leg/"+link,res,app);
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
	senadores2: function (req, res, app, cb ){
		console.log("sen2");
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
				// funcs=[];
				// for (var i = 0; i < list.length; i++) {
				// 	//list[i]
				// 	funcs[i]=function(callback){
				// 	        processSen(list[i],app,callback);
				// 	    }

				// };
				// async.series(funcs,
				// function(err, results) {
				// 	console.log(results);
				//     // results is now equal to: {one: 1, two: 2}
				// });
				for (var i = 0; i < 60; i++){//list.length; i++) {
					subject=list[i];

					processSen(subject,app,function( senador ){
						//console.log( "RESULTADOS >>" , senador );
						app.models[ "diputados" ].find({name:senador.name}).exec(function (err, usersNamedFinn){
							  if ("err",err) {
							    console.log(err);
							  }
							  if (usersNamedFinn.length==0) {
							  	app.models[ "diputados" ].create(senador).exec(function createCB(err, created){
						            console.log("errcreating:",err);
						            console.log("body",created);
						            //res.end( JSON.stringify( [ 1 , created] )  );
						        });
							  }
							  else{
							  	console.log("existed",senador.name);
							  	//res.end( JSON.stringify( [0,"existed"] ) );
							  }
						  	
						});
						
					});
				};
				
	},
	senadores: function ( req, res, app, cb ){
		listlinks=[];
		alf=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","X","Y","Z"] //25
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
	iniciativas: function ( req, res, app, cb ){
		console.log("iniciativas")
		var c = new Crawler({
		    maxConnections : 100,
		    forceUTF8:true,		    
		    callback : function (error, result, $) {

		    	console.log("uri",result.uri);
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
						var test = test8859;//decodeURIComponent(unescape(test8859));
		        	 	switch(index2) {
						    case 1:
						        if (test=="Iniciativa") {ini.type="i"}
						        break;
						    case 2:
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
						        ini.autor=cleanText(test);
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

		        	 	//console.log(index2+"->"+test);
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
						  	console.log("vacío",ini.resumen);
						  }
						  
						});
		        		//console.log(index,"-->",ini)
		        		inis.push(ini);
		        		addinis(ini,[],app,function(err){
		        			console.log("dd->"+err);
		        		});
		        		
					
		        });
				console.log(inis);
				//addinis(inis,app);
		    }
		});
		for (var i = 1; i <= 54; i++) { //son 108
			
			c.queue('http://sil.gobernacion.gob.mx/Busquedas/Basica/ResultadosBusquedaBasica.php?SID=794b7fb8c30189fc1ebd537bf0340577&Origen=BB&Serial=2e4f02f769de50ea3f2af91be9353619&Reg=5357&Paginas=100&pagina='+i); //108
			//c.queue('http://sil.gobernacion.gob.mx/Busquedas/Basica/ResultadosBusquedaBasica.php?SID=89491a500e9f8eca9b84db1b0f9de8a2&Serial=b44c1a966e8125f0d6e878d291773ac2&Reg=1543&Origen=BB&Paginas='+i); //31
		}

	},
	pas: function ( req, res, app, cb ){
		console.log("puntos de acuerdo")
		console.log("P A's")
		var c = new Crawler({
		    maxConnections : 100,
		    forceUTF8:true,		    
		    callback : function (error, result, $) {
		    	app.models[ "diputados" ].find({ ordenDeGobierno: "Federal" }).exec(function (err, dips){
					  if (err) {
					    console.log(err);
					  }
					  else{
					  	console.log('Number dips:',"senadores","Federal", dips.length);
					  	console.log("uri",result.uri);
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
								var test = test8859;//decodeURIComponent(unescape(test8859));
				        	 	switch(index2) {
								    case 1:
								        ini.type="pa";
								        if (test=="Iniciativa") {ini.type="i"}
								        // ini.type="pa"
								        break;
								    case 2:
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
								        ini.autor=cleanText(test);
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

				        	 	//console.log(index2+"->"+test);
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
				        		//console.log(index,"-->",ini)
				        		inis.push(ini);
				        		addinis(ini,dips,app,function(err){
				        			console.log("dd->"+err);
				        		});
				        		
				        		
							
				        });
						console.log(inis);
					  }
				});

		    	
				//addinis(inis,app);
		    }
		});
		////Inis
		// for (var i = 1; i <= 16; i++) {  //xiii
		// 	c.queue('http://sil.gobernacion.gob.mx/Busquedas/Basica/ResultadosBusquedaBasica.php?SID=23579d8bd1d3c412c37a08e95bf07b09&Origen=BB&Serial=e95932f521c18293d9b9363384b3a282&Reg=1563&Paginas=100&pagina='+i); //4
		// }
		// for (var i = 1; i <= 54; i++) {  //xii
		// 	c.queue('http://sil.gobernacion.gob.mx/Busquedas/Basica/ResultadosBusquedaBasica.php?SID=2cd6c607634434ec8f53775e98529189&Origen=BB&Serial=85b6573d515be9f60877151efdca256a&Reg=5357&Paginas=100&pagina='+i); //4
		// }
		////pas
		for (var i = 1; i <= 27; i++) {  //xiii
			c.queue('http://sil.gobernacion.gob.mx/Busquedas/Basica/ResultadosBusquedaBasica.php?SID=f16d7a4f419ea06a57abbe34470d1c22&Origen=BB&Serial=471c770316700be0e8a9af86bab1ff94&Reg=2611&Paginas=100&pagina='+i); //4
		}
		for (var i = 1; i <= 85; i++) {  //xii
			c.queue('http://sil.gobernacion.gob.mx/Busquedas/Basica/ResultadosBusquedaBasica.php?SID=71acdf5a255ccf13a8b41fefdafd42e0&Origen=BB&Serial=9d116a115c9fd2b4b3c81db52dcfc651&Reg=8456&Paginas=100&pagina='+i); //4
		}
		// for (var i = 1; i <= 85; i++) { 

		// 	//c.queue('http://sil.gobernacion.gob.mx/Busquedas/Basica/ResultadosBusquedaBasica.php?SID=1b7fe5faf68c057808cda1c17af5b9b9&Origen=BB&Serial=11a35874e082f61deecbb96264b823ae&Reg=2562&Paginas=100&pagina='+i); //10
		// 	c.queue('http://sil.gobernacion.gob.mx/Busquedas/Basica/ResultadosBusquedaBasica.php?SID=7609bda38979160484afd0b3c25615d3&Origen=BB&Serial=ca51c60679cb46634640e754138238fe&Reg=8455&Paginas=100&pagina='+i); //4
		// }
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
		    	// tot.debate=inter;
		    	// tot.completo=intercomp;
		    	//next(null,tot);
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
		    	// tot.debate=inter;
		    	// tot.completo=intercomp;
		    	//next(null,tot);
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
	}
}
function addinis(ini,dips,app,done){
	if(ini.type=="i" || ini.type=="pa"){
		app.models[ "trabajo" ].find({resumen:ini.resumen}).exec(function (err, usersNamedFinn){
		  if ("err",err) {
		    console.log(err);
		  }
		  if (usersNamedFinn.length==0) {
		  	app.models[ "trabajo" ].create(ini).exec(function createCB(err, created){
		  		if(!err && created.autor){
		  			for (var i = 0; i < dips.length; i++) {
			  			name=dips[i].name.toLowerCase();
	        			autor=created.autor.toLowerCase();
						if (autor.indexOf(name)>-1 && name.length>2) {
							
							app.models[ "diputados" ].find({id:dips[i].id}).exec(function(e,r){
							  r[0].work.add(created.id);
							  r[0].save(function(err,res){
							    console.log("link saved",res);
							  });
							});

							console.log("linkin",name,autor);
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
		  else{
		  	console.log("existed",ini.resumen);
		  	done("existed");
		  }
		  
		});
	}
	else{
		done("not filled")
	}
	console.log(ini);
			//inis[i]
		
		
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
			    			val=$(elem).parent("tr").find(".tddatosazul").find("b").text();
			    			vals=val.split(", ");
			    			dip["name"]=vals[1]+" "+vals[0];
			    		}
			    		else if (cat.indexOf("Partido")>-1) { // name
			    			dip["party"]=val;
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
							//console.log(tit); //Del año
						}
						else{
							if(tit=="Comisión"){
								all=$(elem).text();
					    		//console.log("-_-"+ all)

					    		puesto=cleanText( $(elem).find("td").eq(1).text() );
					    		comision=cleanText( $(elem).find("td").eq(0).text() );
					    		comision=comision.replace(" (C. Diputados)","");
					    		dip["comisiones"].push({puestocom:puesto , namecom: comision });
					    		console.log("comision:",puesto,"-",comision)
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
									console.log("YEI",rub, index,$(elem2).text());
									starts=$(elem2).find(".tddatosazul").eq(0).text();
									ends=$(elem2).find(".tddatosazul").eq(1).text();
									trabajo=$(elem2).find(".tddatosazul").eq(2).text();
									//console.log("trayectoria",starts,ends,trabajo);
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
					dip["camara"]=camara;//"diputados";
			    	app.models[ "diputados" ].find({name:dip.name}).exec(function (err, usersNamedFinn){
						  if ("err",err) {

						    console.log(err);
						  }
						  if (usersNamedFinn.length==0) {
						  	console.log("nonexistent",dip.name)
						  	next(null,dip);
						  	// app.models[ "diputados" ].create(dip).exec(function createCB(err, created){
					    //         console.log("errcreating:",err);
					    //         console.log("body",created);
					    //         //console.log(dip);
			    		// 		next(null,dip);
					    //     });
						  }
						  else{

						  	app.models[ "diputados" ].update({name:dip.name},{trayectoria:dip.trayectoria}).exec(function afterwards(err, updated){
							  console.log("existed",dip.name);
						  		next(null,dip);
							  console.log('Updated user to have name ' + updated[0].name , updated[0].trayectoria);
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
