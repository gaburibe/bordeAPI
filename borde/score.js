
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
	senH: function ( req, res, app, cb ){

		async.series({
			inis:function (next){
				legis=["LXII","LXIII"]
				getTrabajo( "i" , "Federal" , "senadores", legis , app ,function (status,inis){
					next(null,inis);
				})
			},
			pas:function (next){
				getTrabajo( "pa" , "Federal" , "senadores", legis , app ,function (status,pas){
					next(null,pas);
				})
			},
			list:function (next){
				date=moment();//("13/05/1986","dd/mm/yyyy");
				makelist( "senadores" , "Federal" , app ,function (status,dips){
					next(null,dips);
				})
			}
		} , function(err, results){
			console.log("subjects",results.list.length);
			console.log("work",results.inis.length,results.pas.length);
			date=moment();
			bordescore3(results.inis , results.pas ,results.list, date , app , function( bs ){
				// recordBS(dips,app);
				console.log("RANKS-O",bs.length);
				// app.models[ "diputados" ].update(dips[key].id , {bs:dips[key].bs}).exec(function createCB(err, created){
		  //           console.log("udated",created[0].name,created[0].bs);
		  //       });
				res.end( JSON.stringify( bs ) );
			})
			
		})


		console.log("miau ;)");
		
		
	},
	dipH: function ( req, res, app, cb ){

		async.series({
			inis:function (next){
				legis=["LXIII"]
				getTrabajo( "i" , "Federal" , "diputados", legis , app ,function (status,inis){
					next(null,inis);
				})
			},
			pas:function (next){
				getTrabajo( "pa" , "Federal" , "diputados", legis , app ,function (status,pas){
					next(null,pas);
				})
			},
			list:function (next){
				date=moment();//("13/05/1986","dd/mm/yyyy");
				makelist( "diputados" , "Federal" , app ,function (status,dips){
					next(null,dips);
				})
			}
		} , function(err, results){
			date=moment();
			console.log("subjects",results.list.length);
			console.log("work",results.inis.length,results.pas.length);
			bordescore3(results.inis , results.pas ,results.list, date , app , function( bs ){
				res.end( JSON.stringify( bs ) );
			})
			
		})


		console.log("miau ;)");
		
		
	},
	dipchafa: function ( req, res, app, cb ){

		async.series({
			inis:function (next){
				legis=["LXIII"]
				getTrabajo( "i" , "Federal" , "diputados", legis , app ,function (status,inis){
					next(null,inis);
				})
			},
			pas:function (next){
				getTrabajo( "pa" , "Federal" , "diputados", legis , app ,function (status,pas){
					next(null,pas);
				})
			},
			list:function (next){
				date=moment();//("13/05/1986","dd/mm/yyyy");
				makelist( "diputados" , "Federal" , app ,function (status,dips){
					next(null,dips);
				})
			}
		} , function(err, results){
			date=moment();
			autores={};
			for (var i = 0; i < results.inis.length; i++) {
				if ( !autores[ results.inis[i].autor ] ) {
					autores[ results.inis[i].autor ]=1;

				}
				else{
					autores[ results.inis[i].autor ] +=1;
				}
			}
			
			var sortable = [];
			for (var autor in autores){
				sortable.push([autor, autores[autor]])
			}
			      
			sortable.sort(function(a, b) {return a[1] - b[1]})

			console.log(autores,sortable);
			// bordeScore(results.inis , results.pas ,results.list, date , app , function( bs ){
			// 	res.end( JSON.stringify( bs ) );
			// })
			
		})


		console.log("miau ;)");
		
		
	},
	senchafa: function ( req, res, app, cb ){

		async.series({
			inis:function (next){
				legis=["LXIII"]
				getTrabajo( "i" , "Federal" , "senadores", legis , app ,function (status,inis){
					next(null,inis);
				})
			},
			pas:function (next){
				getTrabajo( "pa" , "Federal" , "senadores", legis , app ,function (status,pas){
					next(null,pas);
				})
			},
			list:function (next){
				date=moment();//("13/05/1986","dd/mm/yyyy");
				makelist( "senadores" , "Federal" , app ,function (status,dips){
					next(null,dips);
				})
			}
		} , function(err, results){
			date=moment();
			autores={};
			for (var i = 0; i < results.inis.length; i++) {
				if ( !autores[ results.inis[i].autor ] ) {
					autores[ results.inis[i].autor ]=1;

				}
				else{
					autores[ results.inis[i].autor ] +=1;
				}
			}
			
			var sortable = [];
			for (var autor in autores){
				sortable.push([autor, autores[autor]])
			}
			      
			sortable.sort(function(a, b) {return a[1] - b[1]})

			console.log(autores,sortable);
			// bordeScore(results.inis , results.pas ,results.list, date , app , function( bs ){
			// 	res.end( JSON.stringify( bs ) );
			// })
			
		})


		console.log("miau ;)");
		
		
	},

}
function bordescore3(inis,pas,list, date, app, end){
	dips={};
	bs={};
	ranks=[];
	ranks_ini=[];
	ranks_pa=[];
	ranks_debate=[];
	ranks_asistencia=[];
	maxr=0;

	async.forEachSeries(list, function(legis, callback) { 
        bs={};
        ini_a=1.8;
        ini_d=1.5;
        ini_p=1;
        ini_r=.5;
		trabajo=[];
		name=legis.name.toLowerCase();
		party=legis.party;
		iddip=legis.id;
		dips[iddip]={ medios:0 , debate:0, inis:0 , pas:0 , asistencia:0 , bs:0 };
		
		console.log(name);
		console.log("-------------");
		for (var j = 0; j < legis.work.length; j++) {
			type=legis.work[j].type;
			estado=legis.work[j].estado;
			if (type=="pa") {
				console.log("+1 pa")
				dips[iddip].pas+=1;
			}
			if (type=="i") {
				
				if ( estado.indexOf("CAMARA REVISORA") > -1 ) {
					console.log("aprobada");
					dips[iddip].inis+=ini_a;
				}
				else if( estado.indexOf("PUBLICADO EN D.O.F") > -1 ){
					console.log("aprobada")
					dips[iddip].inis+=ini_a;
				}
				else if( estado.indexOf("DEVUELTO A CAMARA DE ORIGEN") > -1 ){
					console.log("aprobada")
					dips[iddip].inis+=ini_a;
				}
				else if( estado.indexOf("TURNADO AL EJECUTIVO") > -1 ){
					console.log("aprobada")
					dips[iddip].inis+=ini_a;
				}
				else if( estado.indexOf("DEVUELTO A COMISION(ES) DE CAMARA DE ORIGEN") > -1 ){
					console.log("aprobada")
					dips[iddip].inis+=ini_a;
				}
				else if( estado.indexOf("DICTAMEN NEGATIVO APROBADO EN CAMARA DE ORIGEN") > -1 ){
					console.log("rechazada")
					dips[iddip].inis+=ini_r;
				}
				else if( estado.indexOf("DESECHADO") > -1 ){
					console.log("rechazada")
					dips[iddip].inis+=ini_r;
				}
				else if( estado.indexOf("DE PRIMERA LECTURA EN CAMARA DE ORIGEN") > -1 ){
					console.log("Dictaminada");
					dips[iddip].inis+=ini_d;
				}
				else if( estado.indexOf("RETIRADA") > -1 ){
					console.log("retirada");
				}
				else{
					console.log("presentada");
					dips[iddip].inis+=ini_p;
				}
				
				console.log("+1 i")
				
			}
		}
		if (legis.newslist) {
			for (var j = 0; j < legis.newslist.length; j++) {
					dips[iddip].medios+=1;
			}
		}
		
		
		for (var dia_asist in legis.asistencia) {
	        
	        if ( legis.asistencia[dia_asist].indexOf("ASISTENCIA")>-1 && name.length>2) {
				dips[iddip].asistencia+=1;
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
		
		bs.bs1=( dips[iddip].inis*4 + dips[iddip].pas + dips[iddip].debate/7 ) 
			+ dips[iddip].asistencia/70;
		if (bs.bs1 > maxr) {maxr=bs.bs1;}
		// console.log(iddip,"bs1",bs.bs1)
		
		bs.bs2=0;
		bs.bs3=0;
		bs.bs=Math.ceil( bs.bs1+bs.bs2+bs.bs3 );

		bs.asistencia=dips[iddip].asistencia/70;
		if ( ranks_asistencia.indexOf(bs.asistencia)<0 ) {
			ranks_asistencia.push(bs.asistencia);
		}
		bs.inis=dips[iddip].inis*3;
		if ( ranks_ini.indexOf(bs.inis)<0 ) {
			ranks_ini.push(bs.inis);
		}
		bs.pas=dips[iddip].pas;
		if ( ranks_pa.indexOf(bs.pas)<0 ) {
			ranks_pa.push(bs.pas);
		}
		bs.debate=dips[iddip].debate/7;
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
        console.log("DONE")
        end(dips);
    });
	
}
function bordescore2(inis,pas,list, date, app, end){
	dips={};
	bs={};
	ranks=[];
	ranks_ini=[];
	ranks_pa=[];
	ranks_debate=[];
	ranks_asistencia=[];
	maxr=0;

	for (var i = 0; i < list.length; i++) {
		bs={};
		trabajo=[];
		name=list[i].name.toLowerCase();
		party=list[i].party;
		iddip=list[i].id;
		dips[iddip]={ medios:0 , debate:0, inis:0 , pas:0 , asistencia:0 , bs:0 };
		
		console.log(name);
		console.log("-------------");
		for (var j = 0; j < list[i].work.length; j++) {
			if (type=="pa") {
				console.log("+1 pa")
				dips[iddip].pas+=1;
			}
			if (type=="i") {
				console.log("+1 i")
				dips[iddip].inis+=1;
			}
		}
		if (list[i].newslist) {
			for (var j = 0; j < list[i].newslist.length; j++) {
					dips[iddip].medios+=1;
			}
		}
		
		
		for (var dia_asist in list[i].asistencia) {
	        
	        if ( list[i].asistencia[dia_asist].indexOf("ASISTENCIA")>-1 && name.length>2) {
				dips[iddip].asistencia+=1;
			}
	    }
	    for (var dia_deb in list[i].debate) {
	    	presdate=moment(dia_deb);
	    	if ( date.diff(presdate, 'days') > 0 ) {

	    	}
			dips[iddip].debate+=list[i].debate[dia_deb];
	    }
	//     ranks_ini=[];
	// ranks_pa=[];
	// ranks_debate=[];
	// ranks_asistencia=[];
		
		bs.bs1=( dips[iddip].inis*3 + dips[iddip].pas ) 
			+ dips[iddip].asistencia/70 + dips[iddip].debate/7;
		if (bs.bs1 > maxr) {maxr=bs.bs1;}
		// console.log(iddip,"bs1",bs.bs1)
		
		bs.bs2=0;
		bs.bs3=0;
		bs.bs=Math.ceil( bs.bs1+bs.bs2+bs.bs3 );

		bs.asistencia=dips[iddip].asistencia/70;
		if ( ranks_asistencia.indexOf(bs.asistencia)<0 ) {
			ranks_asistencia.push(bs.asistencia);
		}
		bs.inis=dips[iddip].inis*3;
		if ( ranks_ini.indexOf(bs.inis)<0 ) {
			ranks_ini.push(bs.inis);
		}
		bs.pas=dips[iddip].pas;
		if ( ranks_pa.indexOf(bs.pas)<0 ) {
			ranks_pa.push(bs.pas);
		}
		bs.debate=dips[iddip].debate/7;
		if ( ranks_debate.indexOf(bs.debate)<0 ) {
			ranks_debate.push(bs.debate);
		}

		if ( ranks.indexOf(bs.bs)<0 ) {
			ranks.push(bs.bs);
		}
		dips[iddip].name=name;
		dips[iddip].party=party;
		dips[iddip].bs=bs;
		//console.log(dips[iddip])
		app.models[ "diputados" ].update(iddip, {bs:dips[iddip].bs}).exec(function createCB(err, created){
            console.log("updated",created[0].name,created[0].bs);
        });
	}

	ranks.sort(function(a, b){return b-a});
	ranks_pa.sort(function(a, b){return b-a});
	ranks_debate.sort(function(a, b){return b-a});
	ranks_ini.sort(function(a, b){return b-a});
	ranks_asistencia.sort(function(a, b){return b-a});

	console.log("for--------------->")
	rdips=[];
	for (var key in dips) {
		for (var i = 0; i < ranks.length; i++) {
			if(dips[key].bs.bs==ranks[i]){
				dips[key].bs.r=i;
			}
		}
		for (var i = 0; i < ranks_pa.length; i++) {
			if(dips[key].bs.pas==ranks_pa[i]){
				dips[key].bs.r_pa=i;
			}
		}
		for (var i = 0; i < ranks_debate.length; i++) {
			if(dips[key].bs.debate==ranks_debate[i]){
				dips[key].bs.r_debate=i;
			}
		}
		for (var i = 0; i < ranks_ini.length; i++) {
			if(dips[key].bs.inis==ranks_ini[i]){
				dips[key].bs.r_ini=i;
			}
		}
		for (var i = 0; i < ranks_asistencia.length; i++) {
			if(dips[key].bs.asistencia==ranks_asistencia[i]){
				dips[key].bs.r_asistencia=i;
			}
		}
		app.models[ "diputados" ].update(dips[key].id , {bs:dips[key].bs}).exec(function createCB(err, created){
            console.log("updated",created[0].name,created[0].bs);
        });
	}
	
	console.log("superdate",date.toString());
	//console.log("rdips",dips)
	//rdips.sort(compare);
	//console.log("rdips",rdips)
	end(dips);
}
function bordeScore(inis,pas,list, date, app, end){
	dips={};
	bs={};
	ranks=[];
	ranks_ini=[];
	ranks_pa=[];
	ranks_debate=[];
	ranks_asistencia=[];
	maxr=0;
	for (var i = 0; i < list.length; i++) {
		bs={};
		trabajo=[];
		name=list[i].name.toLowerCase();
		iddip=list[i].id;
		dips[iddip]={ debate:0, inis:0 , pas:0 , asistencia:0 , bs:0 };
		
		console.log(name);
		console.log("-------------");
		for (var j = 0; j < inis.length; j++) {
			presdate=moment( inis[j].presentacion , "dd/mm/yyyy" );
			names=name.split(" ");
			autor=inis[j].autor.toLowerCase();
			if (autor.indexOf(name)>-1 && name.length>2  ) {
				trabajo.push(inis[j].id);
				dips[iddip].inis+=1;
				var day = moment( inis[j].presentacion.trim() , "DD/MM/YYYY" );
			}
		}
		
		for (var j = 0; j < pas.length; j++) {
			presdate=moment( pas[j].presentacion , "dd/mm/yyyy" );
			names=name.split(" ");
			autor=pas[j].autor.toLowerCase();
			if (autor.indexOf(name)>-1 && name.length>2 && date.diff(presdate, 'days') > 0) {
				trabajo.push(pas[j].id);
				dips[iddip].pas+=1;
			}
		}
		console.log("supertrabajo",trabajo);
		app.models[ "diputados" ].findOne(iddip).exec(function(err, user) {
		  // for (var i = 0; i < trabajo.length; i++) {
		  // 	user.work.add(trabajo);
		  // 	console.log("adin",user.id,trabajo[i])
		  // }
		  user.work.add(trabajo);
		  user.save(function(err) {
		  	console.log("alleluya",err);
		  });
		});
		for (var dia_asist in list[i].asistencia) {
	        
	        if ( list[i].asistencia[dia_asist].indexOf("ASISTENCIA")>-1 && name.length>2) {
				dips[iddip].asistencia+=1;
			}
	    }
	    for (var dia_deb in list[i].debate) {
	    	presdate=moment(dia_deb);
	    	if ( date.diff(presdate, 'days') > 0 ) {

	    	}
			dips[iddip].debate+=list[i].debate[dia_deb];
	    }
	//     ranks_ini=[];
	// ranks_pa=[];
	// ranks_debate=[];
	// ranks_asistencia=[];
		
		bs.bs1=( dips[iddip].inis*3 + dips[iddip].pas ) 
			+ dips[iddip].asistencia/70 + dips[iddip].debate/7;
		if (bs.bs1 > maxr) {maxr=bs.bs1;}
		
		bs.bs2=0;
		bs.bs3=0;
		bs.bs=Math.ceil( bs.bs1+bs.bs2+bs.bs3 );

		bs.asistencia=dips[iddip].asistencia/70;
		if ( ranks_asistencia.indexOf(bs.asistencia)<0 ) {
			ranks_asistencia.push(bs.asistencia);
		}
		bs.inis=dips[iddip].inis*3;
		if ( ranks_ini.indexOf(bs.inis)<0 ) {
			ranks_ini.push(bs.inis);
		}
		bs.pas=dips[iddip].pas;
		if ( ranks_pa.indexOf(bs.pas)<0 ) {
			ranks_pa.push(bs.pas);
		}
		bs.debate=dips[iddip].debate/7;
		if ( ranks_debate.indexOf(bs.debate)<0 ) {
			ranks_debate.push(bs.debate);
		}

		if ( ranks.indexOf(bs.bs)<0 ) {
			ranks.push(bs.bs);
		}
		dips[iddip].name=name;
		dips[iddip].bs=bs;
		//console.log(dips[iddip])
		// app.models[ "diputados" ].update(iddip, {bs:dips[iddip].bs}).exec(function createCB(err, created){
  //           //console.log("udated",created);
  //       });
	}
	ranks.sort(function(a, b){return b-a});
	ranks_pa.sort(function(a, b){return b-a});
	ranks_debate.sort(function(a, b){return b-a});
	ranks_ini.sort(function(a, b){return b-a});
	ranks_asistencia.sort(function(a, b){return b-a});

	console.log("for--------------->")
	rdips=[];
	for (var key in dips) {
		for (var i = 0; i < ranks.length; i++) {
			if(dips[key].bs.bs==ranks[i]){
				console.log("mm",dips[key].bs.bs , ranks[i]);
				dips[key].bs.r=i;
			}
		}
		for (var i = 0; i < ranks_pa.length; i++) {
			if(dips[key].bs.pas==ranks_pa[i]){
				console.log("mm pas",dips[key].bs.pas , ranks_pa[i]);
				dips[key].bs.r_pa=i;
			}
		}
		for (var i = 0; i < ranks_debate.length; i++) {
			if(dips[key].bs.debate==ranks_debate[i]){
				console.log("mm debate",dips[key].bs.debate , ranks_debate[i]);
				dips[key].bs.r_debate=i;
			}
		}
		for (var i = 0; i < ranks_ini.length; i++) {
			if(dips[key].bs.inis==ranks_ini[i]){
				console.log("mm inis",dips[key].bs.inis , ranks_ini[i]);
				dips[key].bs.r_ini=i;
			}
		}
		for (var i = 0; i < ranks_asistencia.length; i++) {
			if(dips[key].bs.asistencia==ranks_asistencia[i]){
				console.log("mm asist",dips[key].bs.asistencia , ranks_asistencia[i]);
				dips[key].bs.r_asistencia=i;
			}
		}
		app.models[ "diputados" ].update(dips[key].id , {bs:dips[key].bs}).exec(function createCB(err, created){
            //console.log("udated",created);
        });
	}
	
	console.log("superdate",date.toString());
	//console.log("rdips",dips)
	//rdips.sort(compare);
	//console.log("rdips",rdips)
	
	end(ranks);
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
	for (id in dips) {
		//BS
		if (bsr[dips[id].bs.r]) {
			bsr[dips[id].bs.r].name.push(dips[id].name); //+=","+dips[id].name;
		}
		else{
			bsr[dips[id].bs.r]={y:dips[id].bs.bs1,name:[ {name:dips[id].name,party:dips[id].party,id:id} ]}
		}
		//inis
		if (bsini[dips[id].bs.r_ini]) {
			bsini[dips[id].bs.r_ini].name.push({name:dips[id].name,party:dips[id].party,id:id});//+=","+dips[id].name;
		}
		else{
			bsini[dips[id].bs.r_ini]={y:dips[id].bs.inis,name:[ {name:dips[id].name,party:dips[id].party,id:id} ]}
		}
		//pas
		if (bspa[dips[id].bs.r_pa]) {
			bspa[dips[id].bs.r_pa].name.push({name:dips[id].name,party:dips[id].party,id:id});
		}
		else{
			bspa[dips[id].bs.r_pa]={y:dips[id].bs.pas,name:[ {name:dips[id].name,party:dips[id].party,id:id} ]}
		}
		if (bsdeb[dips[id].bs.r_debate]) {
			bsdeb[dips[id].bs.r_debate].name.push({name:dips[id].name,party:dips[id].party,id:id});//+=","+dips[id].name;
		}
		else{
			bsdeb[dips[id].bs.r_debate]={y:dips[id].bs.debate,name: [ {name:dips[id].name,party:dips[id].party,id:id} ]}
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
