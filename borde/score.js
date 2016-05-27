
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


		console.log("miau ;)");
		
		
	},
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
