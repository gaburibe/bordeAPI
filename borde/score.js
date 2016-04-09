
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
			date=moment();
			bordescore2(results.inis , results.pas ,results.list, date , app , function( bs ){
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
			bordescore2(results.inis , results.pas ,results.list, date , app , function( bs ){
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
		
		
	}
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
		iddip=list[i].id;
		dips[iddip]={ debate:0, inis:0 , pas:0 , asistencia:0 , bs:0 };
		
		console.log(name);
		console.log("-------------");
		for (var j = 0; j < list[i].work.length; j++) {
			if (type="pa") {
				dips[iddip].pas+=1;
			}
			if (type="i") {
				dips[iddip].inis+=1;
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
