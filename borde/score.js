
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
var sstats=require('simple-statistics');
moment.locale('es');


Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


module.exports = module.export =
{
	bs1v3: function (camara, req, res, app, cb){ //BS1 V1.3
		/*
		La versión 1.3 tiene un cáclulo de iniciativas elaborado ya 
		que compara las aprobadas y presentadas con el promedio de su partido.
		El orde de funciones es:
		bs1v3 -> trabajo_legis ->
		*/

		async.series({
			inis:function (next){
				next(null,[]); // COMENTADO PUESTO QUE SE SACA TODA LA INFIORMACIÓN EN "makelist"
			
			},
			pas:function (next){
				next(null,[]);// COMENTADO PUESTO QUE SE SACA TODA LA INFIORMACIÓN EN "makelist"
				
			},
			list:function (next){
				date=moment();
				makelist( camara , "Federal" , app ,function (status,dips){
					next(null,dips);
				})
			}
		} , function(err, results){
			date=moment();
			trabajo_legis(results.list,app,res);
		})
		
	},
	record: function ( req, res, app, cb ){
		app.models[ "diputados" ].find({camara:"diputados"}).exec(function createCB(err, dips){
			document={};
			document.bs=[];
			bsrrank=[];

			document.ini=[];
			document.pas=[];
			
			document.bs=scorefixer(dips,"bsr","br");
			document.ini=scorefixer(dips,"inis");
			document.ini=scorefixer(dips,"pas");
			date=moment();
			dat2=date.toString();
			app.models[ "bs" ].create( {camara:"diputados",date:dat2,document:document} ).exec(function createCB(err, created){
	            console.log("BS created",err);
	        });
		});
	},
	BS2: function ( camara, req, res, app, cb ){ //BS2 V1.0
		makelist( camara , "federal" , app , function(err,dips){
			console.log("BS2 paso1:",dips.length);
			puestoscamara={};
			puestospartido={};
			puestoscomision={};
			puestos={};
			puestoscom={};
			puestosbs2={};
			namedict={};
			testob={};
			for (var i = 0; i < dips.length; i++) {
				testob[dips[i].id]={};
				printer={
				'instituto belisario domingues':"-",
				'mesa directiva':"-",
				'junta de cordinación política':"-",
				'instituto belisario domingues':"-",
				};
				allstring="";
				pc=dips[i].puestoscamara;
				pp=dips[i].puestospartido;
				com=dips[i].comisiones;
				namedict[dips[i].id]=dips[i].name;
				if (!puestos[dips[i].id] || puestoscom[dips[i].id]) {
					puestos[dips[i].id]=[];
					puestoscom[dips[i].id]=[];
				}

				allstring=dips[i].name;

				console.log(dips[i].id+";"+dips[i].name)
				if (pc) {  //evaua los puestos en cámara
					for (puesto in pc) {
						
						puestoscamara[dips[i].id]={
							instancia:puesto,
							puesto:pc[puesto],
							score:catalogaBS2(puesto,pc[puesto])
						};
						printer[puesto]=pc[puesto];
						allstring+=";"+pc[puesto]
						puestos[dips[i].id].push( puestoscamara[dips[i].id] );
						console.log(";"+pc[puesto]+";"+puesto+";"+puestoscamara[dips[i].id].score);
					}
				}
				if (pp && pp.length>0) {  //evaua los puestos en partidos
					for (puesto in pp) {
						puestospartido[dips[i].id]={
							instancia:"partido",
							puesto:pp[puesto],
							score:catalogaBS2("partido",pp[puesto])
						};
						printer["partido"]=pp[puesto];
						puestos[dips[i].id].push( puestospartido[dips[i].id] );
						console.log(";"+pp[puesto]+";"+"partido"+";"+puestospartido[dips[i].id].score);
					}	
				}
				if(com){  //evaua los puestos en comisiones
					for (comision in com) {
						factor=coms_Sen(com[comision].namecom);
						puestoscomision[dips[i].id]={
							instancia:com[comision].namecom,
							puesto:com[comision].puestocom,
							score:factor*catalogaBS2("comision",com[comision].puestocom)
						};
						printer[com[comision].namecom]=com[comision].puestocom;
						puestoscom[dips[i].id].push( puestoscomision[dips[i].id] );
						console.log(";"+com[comision].puestocom+";"+com[comision].namecom+";"+puestoscomision[dips[i].id].score);
					}
				}
				testob[dips[i].id]=printer;
			}
			
			for(diputado in puestos){
				scoreT=0;
				for(instancia in diputado){
					scoreT+=instancia.score
				}
			}
			camp=campana(puestos,100);
			
			camp2=campana(puestoscom,100);
			

			for(idd in camp){
				puestosbs2[idd]=[];
				score=camp[idd].score+camp2[idd].score;
				tk={
							instancia:"BS2",
							puesto:"-",
							score:score
						};
						//console.log("res","id:"+idd,camp[idd].score,camp2[idd].score,score)
				puestosbs2[idd].push( tk );
			}

			campbs2=campana(puestosbs2,100);
			scarr={};
			for(idd in campbs2){ //para hacer reporte
				console.log(idd,";",namedict[idd],";",camp[idd].score,";",camp2[idd].score,";",campbs2[idd].score,";",campbs2[idd].nscore);
				console.log("res","id:"+idd,camp[idd].score,camp2[idd].score,campbs2[idd].score);
				scarr[idd]={
					id:idd,
					bs2_1:camp[idd].nscore,
					bs2_2:camp2[idd].nscore,
					bs2:campbs2[idd].nscore,

				}
			}
			async.forEachSeries(scarr, function(subjectscore, callback) { 
	       		
				//La lista se salva en e campo "BS2"
				app.models[ "diputados" ].update({id:subjectscore.id},{ BS2:subjectscore }).exec(function afterwards(err, updated){//{trayectoria:dip.trayectoria , silid:dip.uriid}).exec(function afterwards(err, updated){
				  	console.log("score BS2 updated",id,updated[0].BS2);
					callback();
				});
				

		    }, function(err) {
		        res.end("DONE")
		    });

			// console.log("c1",camp);
			// console.log("c2",camp2);
			console.log("c3",campbs2);
			console.log("crazy",testob)
			//console.log(camp2);
		});


	},
	graphs: function ( camara, req, res, app, cb ){
		app.models[ "diputados" ].find({ camara:camara, ordenDeGobierno: "federal" }).exec(function (err, dips){
			date=moment();
			score={};
			bsr=[];
			bsini=[];
			bsdeb=[];
			bspa=[];

			dat2=date.toString();
			for (key in dips) {
				sen=dips[key];
				id=sen.id;
				console.log(id,sen.BSA );

				if (sen.BSA ) {
					//BS
					if ( bsr[sen.BSA.BSA]) {
						bsr[sen.BSA.BSA].name.push({name:sen.name,party:sen.party,id:id}); //+=","+dips[id].name;
					}
					else{
						bsr[sen.BSA.BSA]={y:sen.BSA.BSA,name:[ {name:sen.name,party:sen.party,id:id} ]}
					}
					// bsr=scoreorder(bsr);
					//inis
					if (bsini[sen.BS1.iniciativas]) {
						bsini[sen.BS1.iniciativas].name.push({name:sen.name,party:sen.party,id:id});//+=","+dips[id].name;
					}
					else{
						bsini[sen.BS1.iniciativas]={y:sen.BS1.iniciativas,name:[ {name:sen.name,party:sen.party,id:id} ]}
					}
					// bsini=scoreorder(bsini);
					//pas
					if (bspa[sen.BS1.puntosdeacuerdo]) {
						bspa[sen.BS1.puntosdeacuerdo].name.push({name:sen.name,party:sen.party,id:id});
					}
					else{
						bspa[sen.BS1.puntosdeacuerdo]={y:sen.BS1.puntosdeacuerdo,name:[ {name:sen.name,party:sen.party,id:id} ]}
					}
					// bspa=scoreorder(bspa);
					if (bsdeb[sen.BS1.debate]) {
						bsdeb[sen.BS1.debate].name.push({name:sen.name,party:sen.party,id:id});//+=","+dips[id].name;
					}
					else{
						bsdeb[sen.BS1.debate]={y:sen.BS1.debate,name: [ {name:sen.name,party:sen.party,id:id} ]}
					}
					// bsdeb=scoreorder(bsdeb);
				}
				
			}
			bsr2=[]
			bsini2=[]
			bspa2=[]
			bsdeb2=[]
			for(i=0;i<=100;i++){
				if (bsr[i]) {
					for(dim in bsr[i].name){
						bsr2.push({y:i,name:bsr[i].name[dim]});
					}
				}
				if (bsini[i]) {
					for(dim in bsini[i].name){
						bsini2.push({y:i,name:bsini[i].name[dim]});
					}
				}
				if (bspa[i]) {
					for(dim in bspa[i].name){
						bspa2.push({y:i,name:bspa[i].name[dim]});
					}
				}
				if (bsdeb[i]) {
					for(dim in bsdeb[i].name){
						bsdeb2.push({y:i,name:bsdeb[i].name[dim]});
					}
				}

			}
			score.bs=bsr2;
			score.ini=bsini2;
			score.pa=bspa2;
			score.deb=bsdeb2;
			console.log(score)
			app.models[ "bs" ].create( {camara:camara,date:dat2,document:score} ).exec(function createCB(err, created){
		            console.log("BS created",err,created);
		    });
				
		});
	}
}
function scoreorder(list){
	nulist=[];
	for(i=100;i>=0;i--){
		if(list[i]){
			names=list[i].name;
			for(key in names){
				nulist.push( {y:i, name:[ names[key] ] } );
			}
		}
		
		
	}
	return nulist;
}

function trabajo_legis(list,app,res){ // BS1 V1.3
	dips={};
	coleccion_i={};
	coleccion_pa={};
	coleccion_deb={};
	coleccion_asist={};
	coleccion_BS1={};
	maxr=0;
	camara="-";
	aprobadas_legis={};
	aprobadas_party={};
	presentadas_legis={};
	dips={};
	namedict={}
	aprobadas_party_arr={};
	async.forEachSeries(list, function(legis, callback) {  //ciclo sobre todos los legisladores
        
		

		name=legis.name.toLowerCase();

		party=legis.party;
		namedict[legis.id]=legis.name;
		if (!aprobadas_party[party]) {aprobadas_party[party]=0;  } //prepara arrays para agregados en iniciaivas

		iddip=legis.id;
		ini_legis={}
		aprobadas_legis[legis.name]=0;
		presentadas_legis[legis.name]=0;
		dips[legis.name]={presentadas:0,aprobadas:0,pas:0}
		dips[legis.name].pas=0;
		dips[legis.name].asistencia=legis.asistencia;
		if (legis.debate && legis.debate.length>1) {
			dips[legis.name].debatelist=legis.debate;
			console.log("debate",legis.debate.length)
		}
		else{
			dips[legis.name].debatelist=legis.debatelist;
			console.log("debatelist",legis.debatelist.length)
		}
		
		// dips[iddip]={ medios:0 , debate:0, inis:0 , pas:0 , asistencia:0 , bs:0 };
		for (var j = 0; j < legis.work.length; j++) {
			type=legis.work[j].type;
			camara=legis.camara;
			estado=legis.work[j].estado;
			
			if (type=="pa") {
				dips[legis.name].pas+=1;
			}
			if (type=="i") { //Se calculan todos los insumos para agregados aquí
				
				presentadas_legis[legis.name]+=1;
				

				if ( estado.indexOf("CAMARA REVISORA") > -1 ) { //APROBADA
					aprobadas_legis[legis.name]+=1;
					aprobadas_party[party]+=1;
				
				}
				else if( estado.indexOf("PUBLICADO EN D.O.F") > -1 ){ //APROBADA
					aprobadas_legis[legis.name]+=1;
					aprobadas_party[party]+=1;

				}
				else if( estado.indexOf("DEVUELTO A CAMARA DE ORIGEN") > -1 ){ //APROBADA
					aprobadas_legis[legis.name]+=1;
					aprobadas_party[party]+=1;

					
				}
				else if( estado.indexOf("TURNADO AL EJECUTIVO") > -1 ){ //APROBADA
					aprobadas_legis[legis.name]+=1;
					aprobadas_party[party]+=1;

					
				}
				else if( estado.indexOf("DEVUELTO A COMISION(ES) DE CAMARA DE ORIGEN") > -1 ){ //APROBADA
					aprobadas_legis[legis.name]+=1;
					aprobadas_party[party]+=1;

					
				}
				else if( estado.indexOf("DICTAMEN NEGATIVO APROBADO EN CAMARA DE ORIGEN") > -1 ){ //PRESENTADA

				}
				else if( estado.indexOf("DESECHADO") > -1 ){ //PRESENTADA

				}
				else if( estado.indexOf("DE PRIMERA LECTURA EN CAMARA DE ORIGEN") > -1 ){ //PRESENTADA

				}
				else if( estado.indexOf("RETIRADA") > -1 ){ //PRESENTADA

				}
				else{ //DEFAULT

				}
				
				
			}

		}
		if (!aprobadas_party_arr[party]) { aprobadas_party_arr[party]=[]; }
		aprobadas_party_arr[party].push( aprobadas_legis[legis.name] );
		dips[legis.name].id=legis.id;
		dips[legis.name].party=legis.party;
		dips[legis.name].presentadas=presentadas_legis[legis.name];
		dips[legis.name].aprobadas=aprobadas_legis[legis.name];
		
      	callback();
    }, function(err) {
        console.log("DONE");
        //agregados.
        parr=[];
        aarr=[];
        debate_list=[];
        for(key in presentadas_legis){ parr.push( presentadas_legis[key] ) }
        for(key in aprobadas_legis){ aarr.push( aprobadas_legis[key] ) }
        // A continuación se calculan las estadísticas de la fórmula de Ernesto refinada
        mean_presentadas=sstats.mean(parr);
    	mean_aprobadas=sstats.mean(aarr);
    	stdev_presentadas=sstats.standardDeviation(parr)
    	stdev_aprobadas=sstats.standardDeviation(aarr) //aprobadas_party_arr
    	max_aprobadas=sstats.max(aarr); // Máximo de aprobadas 
    	console.log("aprobadas_party_arr",aprobadas_party_arr);
		console.log("preentadas-media",mean_presentadas," aprobadas-media",stdev_presentadas);
		countap=[]; //para sacar el máximo de aprobadas en la legislatura
		for(name in dips){

			dipparty=dips[name].party;
			dips[name].normal_presentadas=0;
			dips[name].factor_presentadas=0;
			dips[name].normal_presentadas=(dips[name].presentadas-mean_presentadas)/stdev_presentadas;
			dips[name].factor_presentadas=Math.ceil( Math.abs( dips[name].normal_presentadas ) );
			stdev_party= sstats.standardDeviation( aprobadas_party_arr[dipparty] );
			mean_party= sstats.mean( aprobadas_party_arr[dipparty] );
			
			dips[name].stats=[party, stdev_party,mean_party];
			dips[name].factor_aprobadas=Math.abs( (dips[name].aprobadas-mean_party)/stdev_party );
			dips[name].scoreP=dips[name].presentadas/dips[name].factor_presentadas;
			dips[name].scoreA=dips[name].factor_aprobadas*dips[name].aprobadas*max_aprobadas;
			dips[name].scoreI=dips[name].scoreP+dips[name].scoreA;
		}
		//Una vez calculadas las estadísticas de la cámara se calcula el score individual de cada uno
		for (nombre in dips) {

			dip=dips[nombre];
			coleccion_deb[dip.id]=[];
			coleccion_asist[dip.id]=[];
			coleccion_i[dip.id]=[];
			coleccion_pa[dip.id]=[];
			coleccion_i[dip.id].push( {tipo:"iniciativas",score:dip.scoreI} );
			coleccion_pa[dip.id].push( {tipo:"pas",score:dip.pas} );
			if (dip.debatelist) {
				coleccion_deb[dip.id].push( {tipo:"debate",score:dip.debatelist.length} );
				dip.debscore=dip.debatelist.length;
			}
			else{
				coleccion_deb[dip.id].push( {tipo:"debate",score:"1"} );
				dip.debscore=1;
			}
			if (dip.asistencia) {
				var size = Object.size(dip.asistencia);
				coleccion_asist[dip.id].push( {tipo:"asistencia",score:size} );
				dip.asistscore=dip.asistencia.length;
			}
			else{
				coleccion_asist[dip.id].push( {tipo:"debate",score:"1"} );
				dip.asistscore=1;
			}
			
			
			console.log(nombre,"-",dip.scoreP,"-",dip.scoreA,"=" ,dip.scoreI,"pas:",dip.pas,"debate:",dip.debscore )

		}
		// Cada score por separado se estandariza haciendo "campana" es decir igualando el mas alto a 100 y escalando los demás a este, una regla de 3
		campana_i=campana(coleccion_i,100);
        console.log("campana inis:",campana_i);
        campana_pa=campana(coleccion_pa,100);
        console.log("campana pas:",campana_pa);
        campana_deb=campana(coleccion_deb,100);
        console.log("campana deb:",campana_deb);
        campana_asist=campana(coleccion_asist,100);
        console.log("campana asistencia:",campana_asist);

        //después de tener los inzumos se calcula el BS1 ciclando el array dips con sus respectivas proporciones dentro del score

        for(nombre in dips){

        	dip=dips[nombre];
        	id=dip.id;
        	coleccion_BS1[id]=[];
        	asistencias=Math.max(campana_asist[id].score, 90);
        	score=( campana_i[id].nscore*.3+campana_pa[id].nscore*.1+campana_deb[id].nscore*.2 )*asistencias*.1;
        	coleccion_BS1[id].push( {tipo:"BS1",score:score} );
        }
        //Hacer campana para calcular con BS2
        campana_BS1=campana(coleccion_BS1,100);
        console.log("campana BS1:",campana_BS1);
        scarr={};
        for(id in campana_BS1){
        	nnamee=namedict[id];
        	scarr[id]={
					id:id,
					iniciativas:campana_i[id].nscore,
					puntosdeacuerdo:campana_pa[id].nscore,
					debate:campana_deb[id].nscore,
					asistencia:campana_asist[id].nscore,
					BS1:campana_BS1[id].nscore
				}
        	console.log(
        			nnamee+";",
        			campana_i[id].nscore+";",
        			campana_pa[id].nscore+";",
        			campana_deb[id].nscore+";",
        			campana_asist[id].nscore+";",
        			campana_BS1[id].nscore
        		);
        }
        async.forEachSeries(scarr, function(subjectscore, callback) { 
	       		
				//La lista se salva en e campo "BS2"
			app.models[ "diputados" ].update({id:subjectscore.id},{ BS1:subjectscore }).exec(function afterwards(err, updated){//{trayectoria:dip.trayectoria , silid:dip.uriid}).exec(function afterwards(err, updated){
			  	console.log("score BS1 updated",updated[0].id,updated[0].BS1);
				callback();
			});
			

	    }, function(err) {
	        res.end("DONE");
	    });

    });
}




//FUNCIONES AUXILIARES

function compare(a,b) {
  if (a.bs.bs < b.bs.bs)
    return -1;
  else if (a.bs.bs > b.bs.bs)
    return 1;
  else 
    return 0;
}

function makelist(camara , ordenDeGobierno , app , done){
	app.models[ "diputados" ].find({ camara:camara , ordenDeGobierno: ordenDeGobierno }).populate("work").exec(function (err, inis){
		  if (err) {
		  	done(err,"--");
		    console.log(err);
		  }
		  else{
		  	console.log('Number dips:',camara,ordenDeGobierno, inis.length);
		  	done(null,inis);
		  }
	});
}

function getTrabajo(type , ordenDeGobierno , camara, legislatura , app , done){
	app.models[ "trabajo" ].find({type:type , ordenDeGobierno: ordenDeGobierno, legislatura:legislatura , camara: camara }).exec(function (err, inis){
		  if (err) {
		  	done(err,"--");
		    console.log(err);
		  }
		  else{
		  	console.log('Number :',type,ordenDeGobierno,camara, inis.length);
		  	done(null,inis);
		  }
	});
}



function catalogaBS2(instancia, puesto){ //WRAPPER: Devuelve los valores calibrados para cada puesto
	var catalogo={
		"mesa directiva":{
			"secretario":3,
			"vicepresidente":3,
			"presidente":4
		},
		"partido":{
			"coordinador":1
		},
		"junta de cordinación política":{
			"presidente":4,
			"miembro":1
		},
		"instituto belisario domingues":{
			"presidente":4,
			"secretario":2
		},
		"cogati":{
			"presidente":4,
			"secretario":2,
			"miembro":1
		},
		 "Comité de Fomento a la Lectura": {
		 	"presidente":4,
			"secretario":2,
		 	"miembro":1
		 },
		"comision":{
			"Presidente":2,
			"presidente":2,
			"secretaría":1,
			"Secretario":1,
			"miembro":.4,
			"Integrante":.4
		}

	}
	if (!catalogo[instancia]) {return -1}
	else{
		return catalogo[instancia][puesto];
	}
	

}
function coms_Sen(comision){
	truecom=comision.toLowerCase();
	coms=["studios legislativ","constitucionales","justicia","gobernaci","educaci"]
	console.log(truecom);
	for (var i = coms.length - 1; i >= 0; i--) {
		if (truecom.indexOf(coms[i]) > -1 ) {
			console.log("match!!!!!");
			return 2;
		}
	}
	return 1;
}

function campana(coleccion,scale){ 
	// Función que estandariza a una escala del 0 a "scale" (normalmente 100).
	//Debe ser del tipo coleccion[id]=[ { instancia: 'Energía', puesto: 'Secretario', score: 1 },{} ]
	campcalc={};
	top=0;
	for(id in coleccion){
		scorelegis=0;
		for(categ in coleccion[id]){
			sc=coleccion[id][categ];
			scorelegis+=sc.score;
		}
		campcalc[id]={score:scorelegis}
		if (scorelegis > top) { top= scorelegis}
	}
	console.log("top",top)
	for(id in campcalc){
		norm=campcalc[id].score*scale/top;
		campcalc[id].nscore=Math.round(norm);
	}
	return campcalc;

}
