
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
	bs1v3: function (camara, req, res, app, cb){ //BS1 versión 1.3
		async.series({
			inis:function (next){
				next(null,[]); // COMENTADO PUESTO QUE SE SACA TODA LA INFIORMACIÓN EN "makelist"
				// legis=["LXII","LXIII"]
				// getTrabajo( "i" , "Federal" , "senadores", legis , app ,function (status,inis){
				// 	next(null,inis);
				// })
			},
			pas:function (next){
				next(null,[]);// COMENTADO PUESTO QUE SE SACA TODA LA INFIORMACIÓN EN "makelist"
				// getTrabajo( "pa" , "Federal" , "senadores", legis , app ,function (status,pas){
				// 	next(null,pas);
				// })
			},
			list:function (next){
				date=moment();
				makelist( camara , "Federal" , app ,function (status,dips){
					next(null,dips);
				})
			}
		} , function(err, results){
			//console.log("subjects",results.list.length);
			date=moment();
			trabajo_legis(results.list,app,res);
			//bs1Suma(inisr);
			// bordescore3(results.inis , results.pas ,results.list, date , app , function( bs ){
			// 	mean=sstats.mean([0, 10]);
			// 	console.log(mean,"mean");
			// })
			
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
	senH: function ( req, res, app, cb ){

		async.series({
			inis:function (next){
				next(null,[]); // COMENTADO PUESTO QUE SE SACA TODA LA INFIORMACIÓN EN "makelist"
				// legis=["LXII","LXIII"]
				// getTrabajo( "i" , "Federal" , "senadores", legis , app ,function (status,inis){
				// 	next(null,inis);
				// })
			},
			pas:function (next){
				next(null,[]);// COMENTADO PUESTO QUE SE SACA TODA LA INFIORMACIÓN EN "makelist"
				// getTrabajo( "pa" , "Federal" , "senadores", legis , app ,function (status,pas){
				// 	next(null,pas);
				// })
			},
			list:function (next){
				date=moment();
				makelist( "senadores" , "Federal" , app ,function (status,dips){
					next(null,dips);
				})
			}
		} , function(err, results){
			console.log("subjects",results.list.length);
			date=moment();
			bordescore3(results.inis , results.pas ,results.list, date , app , function( bs ){
				genrank(app,"senadores")
				//recordBS(results.list,app);
				console.log("RANKS-O O O",bs.length);
				// app.models[ "diputados" ].update(dips[key].id , {bs:dips[key].bs}).exec(function createCB(err, created){
		  //           console.log("udated",created[0].name,created[0].bs);
		  //       });
				//res.end( JSON.stringify( bs ) );
			})
			
		})


		console.log("miau ;)");
		
		
	},
	dipH: function ( req, res, app, cb ){

		async.series({
			inis:function (next){
				next(null,[]); // COMENTADO PUESTO QUE SE SACA TODA LA INFIORMACIÓN EN "makelist"
				// legis=["LXIII"]
				// getTrabajo( "i" , "Federal" , "diputados", legis , app ,function (status,inis){
				// 	next(null,inis);
				// })
			},
			pas:function (next){
				next(null,[]); // COMENTADO PUESTO QUE SE SACA TODA LA INFIORMACIÓN EN "makelist"
				// getTrabajo( "pa" , "Federal" , "diputados", legis , app ,function (status,pas){
				// 	next(null,pas);
				// })
			},
			list:function (next){
				date=moment();//("13/05/1986","dd/mm/yyyy");
				makelist( "diputados" , "Federal" , app ,function (status,dips){
					next(null,dips);
				})
			}
		} , function(err, results){
			bordescore3(results.inis , results.pas ,results.list, date , app , function( bs ){
				genrank(app,"diputados")
				//recordBS(results.list,app);
				console.log("RANKS-O O O",bs.length);
				// app.models[ "diputados" ].update(dips[key].id , {bs:dips[key].bs}).exec(function createCB(err, created){
		  //           console.log("udated",created[0].name,created[0].bs);
		  //       });
				//res.end( JSON.stringify( bs ) );
			})
			
		})
		
		
	},
	BS2: function ( camara, req, res, app, cb ){
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
	BS: function ( camara, req, res, app, cb ){
		app.models[ "diputados" ].find({ camara:camara, ordenDeGobierno: "federal" }).exec(function (err, dips){
			BSS={}; //borde score completo
			for (var i = dips.length - 1; i >= 0; i--) {
				dip=dips[i];
				console.log(dip.id,dip.BS1,dip.BS2)
				if ( dip.BS1 && dip.BS2 ) {

					bsf=dip.BS1.BS1*.7 + dip.BS2.bs2*.3;
					
					BSS[dip.id]=[];
					BSS[dip.id].push( {tipo:"BSF",score:bsf} );
				}
				
			}
			campana_bsf=campana(BSS,100);
			console.log("campana",BSS,campana_bsf);
			async.forEachSeries(dips, function(subject, callback) { 
				BSA={};
				if (campana_bsf[subject.id]) {
					sbsf=campana_bsf[subject.id].nscore;
		       		BS={ // Para gráficas
		       			camara:"diputados",
		       			document:{

		       			}
		       		};
		       		BSA={BSA:sbsf, trabajo:subject.BS1.BS1*.7,rol:subject.BS2.bs2*.3};
		       		
					//La lista se salva en e campo "BS2"
					app.models[ "diputados" ].update({id:subject.id},{ BSA:BSA }).exec(function afterwards(err, updated){//{trayectoria:dip.trayectoria , silid:dip.uriid}).exec(function afterwards(err, updated){
					  	console.log("score BSA updated",updated[0].id,updated[0].BSA);
						callback();
					});
				}
	       		else{
	       				callback();
	       		}

		    }, function(err) {
		        res.end("DONE")
		    });
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
function pa_score(list){

}
function bs1Suma(trabajo){


}
function trabajo_legis(list,app,res){
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
				//dips[iddip].pas+=1;
			}
			if (type=="i") { //Se calculan todos losagregados aquí
				
				presentadas_legis[legis.name]+=1;
				//aprobadas_party[party]=[];

				if ( estado.indexOf("CAMARA REVISORA") > -1 ) {
					aprobadas_legis[legis.name]+=1;
					aprobadas_party[party]+=1;
				
				}
				else if( estado.indexOf("PUBLICADO EN D.O.F") > -1 ){
					aprobadas_legis[legis.name]+=1;
					aprobadas_party[party]+=1;

				}
				else if( estado.indexOf("DEVUELTO A CAMARA DE ORIGEN") > -1 ){
					aprobadas_legis[legis.name]+=1;
					aprobadas_party[party]+=1;

					
				}
				else if( estado.indexOf("TURNADO AL EJECUTIVO") > -1 ){
					aprobadas_legis[legis.name]+=1;
					aprobadas_party[party]+=1;

					
				}
				else if( estado.indexOf("DEVUELTO A COMISION(ES) DE CAMARA DE ORIGEN") > -1 ){
					aprobadas_legis[legis.name]+=1;
					aprobadas_party[party]+=1;

					
				}
				else if( estado.indexOf("DICTAMEN NEGATIVO APROBADO EN CAMARA DE ORIGEN") > -1 ){

				}
				else if( estado.indexOf("DESECHADO") > -1 ){

				}
				else if( estado.indexOf("DE PRIMERA LECTURA EN CAMARA DE ORIGEN") > -1 ){

				}
				else if( estado.indexOf("RETIRADA") > -1 ){

				}
				else{

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

		campana_i=campana(coleccion_i,100);
        console.log("campana inis:",campana_i);
        campana_pa=campana(coleccion_pa,100);
        console.log("campana pas:",campana_pa);
        campana_deb=campana(coleccion_deb,100);
        console.log("campana deb:",campana_deb);
        campana_asist=campana(coleccion_asist,100);
        console.log("campana asistencia:",campana_asist);

        //después de tener los inzumos se calcula el BS1 ciclando dips

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
        // return campana_BS1;

    });
}
function bordescore3(inis,pas,list, date, app, end){ //Función principal de cálculo
	dips={};
	bs={};
	ranks=[];
	ranks_ini=[];
	ranks_pa=[];
	ranks_debate=[];
	ranks_asistencia=[];
	agregados={};
	agregados.i_p_c=0; //Presentados cámara
	agregados.i_a_c=0; //Aprobados cámara
	agregados.i_p_p={}; //Presentados partido
	agregados.i_a_p={}; //Aprobados partido
	agregados.partycount={};
	maxr=0;
	camara="-";
	async.forEachSeries(list, function(legis, callback) {  //ciclo sobre todos los legisladores
        bs={};
        stats={};
        stats.ip=0;
        stats.ia=0;
        ini_a=1.8;
        ini_d=1.5;
        ini_p=1;
        ini_r=.5;
		trabajo=[];
		name=legis.name.toLowerCase();

		party=legis.party;

		if (agregados.partycount[party]) { agregados.partycount[party]+=1; } //prepara arrays para agregados en iniciaivas
		else{ agregados.partycount[party]=1; }

		iddip=legis.id;
		dips[iddip]={ medios:0 , debate:0, inis:0 , pas:0 , asistencia:0 , bs:0 };

		for (var j = 0; j < legis.work.length; j++) {
			type=legis.work[j].type;
			camara=legis.camara;
			estado=legis.work[j].estado;
			if (type=="pa") {
				dips[iddip].pas+=1;
			}
			if (type=="i") { //Se calculan todos losagregados aquí
				//i_a_c iniciativas aprobadas
				//i_p_c iniciativas presentadas
				//i_a_p iniciativas aprobadas por partido
				//i_p_p iniciativas presentadas por partido
				stats.ip+=1;
				agregados.i_p_c+=1;
				if (agregados.i_p_p[legis.party]) { agregados.i_p_p[legis.party]+=1; }
				else{ agregados.i_p_p[legis.party]=1; }

				if ( estado.indexOf("CAMARA REVISORA") > -1 ) {
					stats.ia+=1;
					//console.log("aprobada");
					dips[iddip].inis+=ini_a;
					agregados.i_a_c+=1;
					if (agregados.i_a_p[legis.party]) { agregados.i_a_p[legis.party]+=1; }
					else{ agregados.i_a_p[legis.party]=1; }
				}
				else if( estado.indexOf("PUBLICADO EN D.O.F") > -1 ){
					stats.ia+=1;
					//console.log("aprobada")
					dips[iddip].inis+=ini_a;
					agregados.i_a_c+=1;
					if (agregados.i_a_p[legis.party]) { agregados.i_a_p[legis.party]+=1; }
					else{ agregados.i_a_p[legis.party]=1; }
				}
				else if( estado.indexOf("DEVUELTO A CAMARA DE ORIGEN") > -1 ){
					stats.ia+=1;
					//console.log("aprobada")
					dips[iddip].inis+=ini_a;
					agregados.i_a_c+=1;
					if (agregados.i_a_p[legis.party]) { agregados.i_a_p[legis.party]+=1; }
					else{ agregados.i_a_p[legis.party]=1; }
				}
				else if( estado.indexOf("TURNADO AL EJECUTIVO") > -1 ){
					stats.ia+=1;
					//console.log("aprobada")
					dips[iddip].inis+=ini_a;
					agregados.i_a_c+=1;
					if (agregados.i_a_p[legis.party]) { agregados.i_a_p[legis.party]+=1; }
					else{ agregados.i_a_p[legis.party]=1; }
				}
				else if( estado.indexOf("DEVUELTO A COMISION(ES) DE CAMARA DE ORIGEN") > -1 ){
					stats.ia+=1;
					//console.log("aprobada")
					dips[iddip].inis+=ini_a;
					agregados.i_a_c+=1;
					if (agregados.i_a_p[legis.party]) { agregados.i_a_p[legis.party]+=1; }
					else{ agregados.i_a_p[legis.party]=1; }
				}
				else if( estado.indexOf("DICTAMEN NEGATIVO APROBADO EN CAMARA DE ORIGEN") > -1 ){
					//console.log("rechazada")
					dips[iddip].inis+=ini_r;
				}
				else if( estado.indexOf("DESECHADO") > -1 ){
					//console.log("rechazada")
					dips[iddip].inis+=ini_r;
				}
				else if( estado.indexOf("DE PRIMERA LECTURA EN CAMARA DE ORIGEN") > -1 ){
					//console.log("Dictaminada");
					dips[iddip].inis+=ini_d;
				}
				else if( estado.indexOf("RETIRADA") > -1 ){
					stats.ia+=0;
					console.log("retirada");
				}
				else{
					console.log("presentada");
					dips[iddip].inis+=ini_p;
				}
				
				
			}
		}
		if (legis.newslist) {
			for (var j = 0; j < legis.newslist.length; j++) {
					dips[iddip].medios+=1;
			}
		}
		
		dips[iddip].asistencia=1;
		for (var dia_asist in legis.asistencia) {
	        
	        if ( legis.asistencia[dia_asist].indexOf("INASISTENCIA")>-1 && name.length>2) {
				dips[iddip].asistencia-=.1;
			}
	    }
	    for (var dia_deb in legis.debate) {
	    	presdate=moment(dia_deb);
	    	if ( date.diff(presdate, 'days') > 0 ) {

	    	}
			dips[iddip].debate+=legis.debate[dia_deb];
	    }
	//     ranks_ini=[];
	// ranks_pa=[];
	// ranks_debate=[];
	// ranks_asistencia=[];
		bs.stats=stats;
		bs.bs1=( dips[iddip].inis*4 + dips[iddip].pas + dips[iddip].debate/7 ) 
			* dips[iddip].asistencia;
		if (bs.bs1 > maxr) {maxr=bs.bs1;}
		// console.log(iddip,"bs1",bs.bs1)
		
		bs.bs2=0;
		bs.bs3=0;
		bs.bs=Math.ceil( bs.bs1+bs.bs2+bs.bs3 );

		bs.asistencia=dips[iddip].asistencia/7;
		if ( ranks_asistencia.indexOf(bs.asistencia)<0 ) {
			ranks_asistencia.push(bs.asistencia);
		}
		bs.inis=dips[iddip].inis;
		if ( ranks_ini.indexOf(bs.inis)<0 ) {
			ranks_ini.push(bs.inis);
		}
		bs.pas=dips[iddip].pas;
		if ( ranks_pa.indexOf(bs.pas)<0 ) {
			ranks_pa.push(bs.pas);
		}
		bs.debate=dips[iddip].debate;
		if ( ranks_debate.indexOf(bs.debate)<0 ) {
			ranks_debate.push(bs.debate);
		}

		if ( ranks.indexOf(bs.bs)<0 ) {
			ranks.push(bs.bs);
		}

		

		dips[iddip].name=name;
		dips[iddip].party=party;
		dips[iddip].bs=bs;
		


		app.models[ "diputados" ].update(iddip, {bs:dips[iddip].bs}).exec(function createCB(err, created){
            console.log("updated",created[0].name,created[0].bs);
            callback();
        });
      
    }, function(err) {
        console.log("DONE");
        //agregados.
        console.log("agregados:",agregados); //(((F5+H5)/2)*100)/((E5+G5)/2) e= f= g= h=

        getbs(app, camara ,agregados ,function(){
        	console.log("done2");
        	end(dips);
        })
        
    });
	
}
function calculateAgg(agregados,legis){
	bs=legis.bs;
	party=legis.party;
	for (var i = 0; i < agregados.i_p_p.length; i++) {
		agregados.i_p_p[i];
	}
	eficienciaRadio=((( agregados.i_a_c+agregados.i_a_p[ party ])/2)*100)/((agregados.i_p_c+agregados.i_p_p[ party ])/2); //I
	eficienciaRadio = eficienciaRadio || 0;
	unico=agregados.i_a_c/agregados.i_p_c;    //J
	eficienciaPersonal=bs.stats.ia/bs.stats.ip; //K
	valorAcomulado=bs.stats.ip*unico*agregados.i_a_c; //L
	ranking=(valorAcomulado+eficienciaPersonal)/2;
	calculated={};
	calculated.eficienciaRadio=eficienciaRadio;
	calculated.unico=unico;
	calculated.eficienciaPersonal=eficienciaPersonal;
	calculated.eficienciaPersonal = calculated.eficienciaPersonal || 0;
	calculated.valorAcomulado=valorAcomulado;
	calculated.nranking=ranking;
	calculated.nranking = calculated.nranking || 0;
	console.log("calculated",calculated);



	calculated.bs=bordescoreGeneral(bs);
	return calculated;
}
function bordescoreGeneral(bs){


}
function getbs(app, camara, agg , cb){
	console.log("GET BS");
	app.models[ "diputados" ].find({camara:camara}).exec(function createCB(err, trs){
		
		ranks=[];
		ranks_ini=[];
		ranks_ini_n=[];

		ranks_pa=[];
		ranks_debate=[];
		ranks_asistencia=[];
		bs={};
		dips={};

		top_inis=0;
		top_pas=0;
		top_debate=0;

		for (var i = 0; i < trs.length; i++) {
			
			calcIni=calculateAgg(agg,trs[i]);


			trs[i].bs.calculated=calcIni;
			bs=trs[i].bs;

			if ( bs.calculated.nranking > top_inis ) {top_inis=bs.calculated.nranking}
			if ( bs.pas > top_pas ) {top_pas=bs.pas}
			if ( bs.debate > top_debate ) {top_debate=bs.debate}

			if ( ranks_ini_n.indexOf(trs[i].bs.calculated.nranking)<0 ) {
				ranks_ini_n.push(trs[i].bs.calculated.nranking);
				console.log("addin rank",ranks_ini_n)
			}

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
			ranks_ini_n.sort(function(a, b){return b-a});
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
			bs.bsr=(bs.calculated.nranking/top_inis)*100 +  (bs.calculated.nranking/top_pas)*50 + (bs.calculated.nranking/top_pas)*20;

			for (var i = 0; i < ranks.length; i++) {
				if(bs.bs==ranks[i]){
					bs.r=i+1;
				}
			}
			for (var i = 0; i < ranks_pa.length; i++) {
				if(bs.pas==ranks_pa[i]){
					bs.r_pa=i+1;
				}
			}
			for (var i = 0; i < ranks_debate.length; i++) {
				if(bs.debate==ranks_debate[i]){
					bs.r_debate=i+1;
				}
			}
			for (var i = 0; i < ranks_ini.length; i++) {
				if(bs.inis==ranks_ini[i]){
					//bs.r_ini=i;
				}
			}
			for (var i = 0; i < ranks_ini_n.length; i++) {
				if(bs.calculated.nranking==ranks_ini_n[i]){
					bs.r_ini=i+1;
				}
			}
			for (var i = 0; i < ranks_asistencia.length; i++) {
				if(bs.asistencia==ranks_asistencia[i]){
					bs.r_asistencia=i+1;
				}
			}
			app.models[ "diputados" ].update(legis.id, {bs:bs}).exec(function createCB(err, created){
	            console.log("updated",created[0].name,created[0].bs);
	            callback();
	        });
			//console.log(bs);
	      	
	    }, function(err) {
	        console.log("DONE");
	        cb();
	    });
				

	});
}
function genrank(app,camara){
	app.models[ "diputados" ].find({camara:camara}).exec(function createCB(err, trs){
		bsrrank=[];

		for (var i = 0; i < trs.length; i++) {
			if (trs[i].bs) {
				bsrrank.push(trs[i].bs.bsr);
			}
			
		}

		bsrrank.sort(function(a, b){return b-a});

		async.forEachSeries(trs, function(legis, callback) { 
			bs={};
			bs=legis.bs;
			for (var j = 0; j < bsrrank.length; j++) {
				if (legis.bs && bsrrank[j]==legis.bs.bsr) {
					bs=legis.bs;
					bs.rb=j+1;
				}
			}
			app.models[ "diputados" ].update(legis.id, {bs:bs}).exec(function createCB(err, created){
	            callback();
	            console.log("saved",bs)
	        });
		}, function(err) {
	        console.log("arranged")	    
	    });	
	});
}
function aggregates(app, camara, cb){

}
function compare(a,b) {
  if (a.bs.bs < b.bs.bs)
    return -1;
  else if (a.bs.bs > b.bs.bs)
    return 1;
  else 
    return 0;
}
function recordBS(dips,app){
	date=moment();
	score={};
	bsr=[];
	bsini=[];
	bsdeb=[];
	bspa=[];

	dat2=date.toString();
	for (sen in dips) {
		//BS
		// if (bsr[sen.bs.r]) {
		// 	bsr[sen.bs.r].name.push(sen.name); //+=","+dips[id].name;
		// }
		// else{
		// 	bsr[sen.bs.r]={y:sen.bs.bs1,name:[ {name:sen.name,party:sen.party,id:id} ]}
		// }
		//inis
		if (bsini[sen.bs.r_ini]) {
			bsini[sen.bs.r_ini].name.push({name:sen.name,party:sen.party,id:id});//+=","+dips[id].name;
		}
		else{
			bsini[sen.bs.r_ini]={y:sen.bs.inis,name:[ {name:sen.name,party:sen.party,id:id} ]}
		}
		//pas
		if (bspa[sen.bs.r_pa]) {
			bspa[sen.bs.r_pa].name.push({name:sen.name,party:sen.party,id:id});
		}
		else{
			bspa[sen.bs.r_pa]={y:sen.bs.pas,name:[ {name:sen.name,party:sen.party,id:id} ]}
		}
		if (bsdeb[sen.bs.r_debate]) {
			bsdeb[sen.bs.r_debate].name.push({name:sen.name,party:sen.party,id:id});//+=","+dips[id].name;
		}
		else{
			bsdeb[sen.bs.r_debate]={y:sen.bs.debate,name: [ {name:sen.name,party:sen.party,id:id} ]}
		}
		

		//bs1.name="name";
		//subject=dips[id];

	}
	score.bs=bsr;
	score.ini=bsini;
	score.pa=bspa;
	score.deb=bsdeb;
	app.models[ "bs" ].create( {camara:"senado",date:dat2,document:score} ).exec(function createCB(err, created){
            console.log("BS created",err,created);
        });
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

function scorefixer(dips,sc,record){
	var br=[];
	fbr=[];
	for (var i = 0; i < dips.length; i++) {
		br.push({ score:dips[i].bs[sc] , id: dips[i].id, party: dips[i].party , name:dips[i].name });
	}
	br.sort(function(a, b) {
	    return parseFloat(b.score) - parseFloat(a.score);
	});
	a=br[0];
	fbr.push({name: [a] , y:a.score });
	for (var i = 1; i < br.length; i++) {
		comulative=[];
		a=br[i-1];
		b=br[i];
		if (a.score==b.score) {
			fbr[fbr.length-1].name.push( b );
			fbr[fbr.length-1].y=b.score;
		}
		else{
			fbr.push({name: [b] , y:b.score });
		}
	}
	if (record) {
		updtatearr=[];
		console.log("record",record);
		for (var i = 0; i < fbr.length; i++) {
			
			legisonscore=fbr[i].name;
			for(legis in legisonscore){
				console.log("legis",legis);
				updtatearr[legis.id]={rank:i,id:legis.id}
				//console.log(updtatearr);
			}
		}
		console.log("updtatearr",updtatearr);
		async.forEachSeries(updtatearr, function(legis2up, callback) {
			console.log("legis2up",legis2up) ;
			callback();
	    }, function(err) {
  			//console.log(fbr);
			return fbr;
	    });

	}
	else{
		console.log(fbr);
		return fbr;
	}
	

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

function campana(coleccion,scale){ //Debe ser del tipo coleccion[id]=[ { instancia: 'Energía', puesto: 'Secretario', score: 1 },{} ]
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
