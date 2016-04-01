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

module.exports = module.export =
{
	
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
		        		//processDip("http://sitl.diputados.gob.mx/LXIII_leg/"+link,res,app);
		        		num+=1;
		        	}
		        	console.log(num,link);
		        });
		        processDip(links,app);
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
				for (var i = 100; i < 130; i++){//list.length; i++) {
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
		        		//processSen('http://www.senado.gob.mx/'+link,res,app);
		        	}

		        	
		        });
		    }
		});
		for (var i = 0; i < alf.length; i++) {
			c.queue('http://www.senado.gob.mx/index.php?ver=int&mn=4&sm=1&str='+alf[i]);
		};
		//processSen('http://www.senado.gob.mx/index.php?ver=int&mn=4&sm=6&id=617',res,app);
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
		        		addinis(ini,app,function(err){
		        			console.log("dd->"+err);
		        		});
		        		
					
		        });
				console.log(inis);
				//addinis(inis,app);
		    }
		});
		for (var i = 1; i <= 31; i++) { //son 108
			//http://sil.gobernacion.gob.mx/Busquedas/Basica/ResultadosBusquedaBasica.php?SID=9870558ae8df7b214357e5091991ce8b&Serial=1cd82af36832ddc61fd0dbd38bc1334a&Reg=1485&Origen=BB&Paginas=50
			//http://sil.gobernacion.gob.mx/Busquedas/Basica/ResultadosBusquedaBasica.php?SID=9870558ae8df7b214357e5091991ce8b&Origen=BB&Serial=1cd82af36832ddc61fd0dbd38bc1334a&Reg=1485&Paginas=50&pagina=30
			//c.queue('http://sil.gobernacion.gob.mx/Busquedas/Basica/ResultadosBusquedaBasica.php?SID=014db79cefe66735761e179d3e83a74f&Origen=BB&Serial=008b138eb49d38e3060752629e8c2b9a&Reg=5357&Paginas=50&pagina='+i); //108
			c.queue('http://sil.gobernacion.gob.mx/Busquedas/Basica/ResultadosBusquedaBasica.php?SID=598f45637055570a61901cc60f710844&Origen=BB&Serial=61c9eab0ce644ec8e2bdb8198e325f1a&Reg=1504&Paginas=50&pagina='+i); //31
		}

	},
	pas: function ( req, res, app, cb ){
		console.log("puntos de acuerdo")
		var c = new Crawler({
		    maxConnections : 100,
		    forceUTF8:true,		    
		    callback : function (error, result, $) {
		    	inis=[];
		    	console.log("--");
		    	tablegen=$('table[width="1000px"]');
		        num=0;
		        dipobject={};
		        tablegen.find('tr').each(function(index, datos) {
		        	console.log("-------->");
		        	ini={};
		        	tds=$(datos).find('td');

		   //      	test=tds[0].text()
		   //      	if (test=="Iniciativa") {ini.type="i"}
		   //      	ini.resumen=tds[1].text()
		   //      	ini.subtype=$(datos).tds[2].text()
		   //      	tt2=tds[3].text()
		   //      	if (tt2.indexOf("Diputados") > -1) {ini.camara="diputados";}
					// else if (tt2.indexOf("Senadores") > -1) {ini.camara="senadores";}
					// ini.presentacion=tds[4].text()
					// ini.autor=cleanText(tds[5].text() );
					// ini.partido=tds[6].text()
					// ini.legislatura=tds[7].text()
					// ini.turnado=tds[8].text()
					// ini.estado=tds[9].text()

		   //      	test=$(datos).children('td:nth-child(1)').text()
		   //      	if (test=="Iniciativa") {ini.type="i"}
		   //      	ini.resumen=$(datos).children('td:nth-child(2)').text()
		   //      	ini.subtype=$(datos).children('td:nth-child(3)').text()
		   //      	tt2=$(datos).children('td:nth-child(4)').text()
		   //      	if (tt2.indexOf("Diputados") > -1) {ini.camara="diputados";}
					// else if (tt2.indexOf("Senadores") > -1) {ini.camara="senadores";}
					// ini.presentacion=$(datos).children('td:nth-child(5)').text()
					// ini.autor=cleanText($(datos).children('td:nth-child(6)').text() );
					// ini.partido=$(datos).children('td:nth-child(7)').text()
					// ini.legislatura=$(datos).children('td:nth-child(8)').text()
					// ini.turnado=$(datos).children('td:nth-child(9)').text()
					// ini.estado=$(datos).children('td:nth-child(10)').text()

		        	$(datos).find('td').each(function(index2,datos2){
		        	 	test8859=$(datos2).text();
						var test = test8859;//decodeURIComponent(unescape(test8859));
		        	 	switch(index2) {
						    case 1:
						        if (test.indexOf("cuerdo")> -1) {ini.type="pa"}
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
						        ini.legislatura=test;
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
						  if (usersNamedFinn.length==0) {
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
		        		addinis(ini,app,function(err){
		        			console.log("dd->"+err);
		        		});
		        		
					
		        });
				console.log(inis);
				//addinis(inis,app);
		    }
		});
		for (var i = 1; i <= 10; i++) { //son 93
			c.queue('http://sil.gobernacion.gob.mx/Busquedas/Basica/ResultadosBusquedaBasica.php?SID=bd08d578ad9f0e10f37cdb8fdc7b5fa5&Serial=8e2b4b44b9b3354bac655a6e23cd5258&Reg=146&Origen=BB&Paginas=50&pagina='+i);
		}
		console.log("P A's")
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
						        if (test=="Acuerdo parlamentario") {ini.type="pa"}
						        ini.type="pa"
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
		        		addinis(ini,app,function(err){
		        			console.log("dd->"+err);
		        		});
		        		
					
		        });
				console.log(inis);
				//addinis(inis,app);
		    }
		});
		for (var i = 1; i <= 10; i++) { 
			//http://sil.gobernacion.gob.mx/Busquedas/Basica/ResultadosBusquedaBasica.php?SID=9870558ae8df7b214357e5091991ce8b&Serial=1cd82af36832ddc61fd0dbd38bc1334a&Reg=1485&Origen=BB&Paginas=50
			//http://sil.gobernacion.gob.mx/Busquedas/Basica/ResultadosBusquedaBasica.php?SID=9870558ae8df7b214357e5091991ce8b&Origen=BB&Serial=1cd82af36832ddc61fd0dbd38bc1334a&Reg=1485&Paginas=50&pagina=30
			//c.queue('http://sil.gobernacion.gob.mx/Busquedas/Basica/ResultadosBusquedaBasica.php?SID=0f836daa4444131ad6c1b09c21802cb1&Origen=BB&Serial=1c1bbb667cef115b9f20a0533deda532&Reg=490&Paginas=50&pagina='+i); //10
			c.queue('http://sil.gobernacion.gob.mx/Busquedas/Basica/ResultadosBusquedaBasica.php?SID=743fa67f508b35669e027a9345d9df81&Serial=87bbb4950c600e3ae3f9f1dfede426af&Reg=146&Origen=BB&Paginas=50&pagina='+i); //4
		}
	}
}
function addinis(ini,app,done){
	if(ini.type=="i" || ini.type=="pa"){
		app.models[ "trabajo" ].find({resumen:ini.resumen}).exec(function (err, usersNamedFinn){
		  if ("err",err) {
		    console.log(err);
		  }
		  if (usersNamedFinn.length==0) {
		  	app.models[ "trabajo" ].create(ini).exec(function createCB(err, created){
	            console.log("errcreating:",err);
	            console.log("body",created);
	            done(null);
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
        function(next){
        	var e = new Crawler({
			    maxConnections : 100,
			    forceUTF8:true,
			    callback : function (error, result, $) {
			    	interv=$('table[cellspacing="0"]');
			    	inter={};
			    	$('table[cellspacing="0"]').each(function(index, datos) {
			    		tt=$(datos).text();
			    		fecha=$(datos).find("strong").last().text();			    		
			    		nums=fecha.split(" de ");
			    		moment.locale('es');
			    		nums2=nums[0].split(" ");
			    		var day = moment(nums2[1]+"/"+nums[1]+"/"+nums[2],"DD/MMM/YYYY");
			    		if (tt.indexOf("Intervención")>-1) {
			    			if (inter[day.toString()]) {inter[day.toString()]+=1;}
			    			else{inter[day.toString()]=1}
			    		}
			    	});
			    	next(null,inter);
			    }
			});
			/////////////
			e.queue("http://www.senado.gob.mx/index.php?ver=int&mn=4&sm=27&id="+subject);
        }
    ],function(err, results){
    	senador=results[0];
    	senador.asistencia=results[1];
    	senador.debate=results[2];
    	done(senador);
	});

	
}
function cleanText(txt){
    txt=txt.trim();
    txt=txt.replace("Sen. ", "");
    txt=txt.replace("Dip. ", "");
    txt=txt.replace("\r", "");
    txt=txt.replace("\n", "");
    txt.replace("\t", "");
    txt=txt.trim();
    return txt;
}
function removeTags(txt){
    var rex = /(<([^>]+)>)/ig;
    return txt.replace(rex , "");
}
