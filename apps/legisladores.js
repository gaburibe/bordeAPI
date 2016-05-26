
/*

	Principal endpoint para acceder y modíficar información sobre legisladores

*/

"use strict();";


var _ = require('lodash')
	, async = require('async')
	, allowed = [ '_id',"ids", 'name' ]; // witch paths are allowed in the get request.

if (process.env.NODE_ENV=='development') console.log("API has loaded");

// All purpose array check for docs, And response, It calls the done that is attached to this via bind.

var returnDocs = function returnDocs ( err, docs )
{

	if ( ! _.isArray( docs ) ) docs = [ docs ];

	this.done( err, _.isEmpty( err ) ? docs : [] );

};

// All purpose async.auto done callback.

var autoDone =  function autoDone ( err, results )
{

	if ( _.isEmpty( err ) ) this.res.end( JSON.stringify( results.do ) );

	else
	{

		this.app.logger.error( err );

		this.res.status( 500 );

		// TODO: change this for a more slim response.
		if ( process.env.NODE_ENV == 'production' ) this.res.end( JSON.stringify( [ err ] ) );
		// dev mode answer.
		else this.res.end( JSON.stringify( [ err, results ] ) );

	}

	this.cb();

};

module.exports = module.export =
{
    post: function post ( req, res, app, cb )
	{
       
        app.models[ "diputados" ].create(req.body).exec(function createCB(err, created){
            console.log("err:"+err);
            console.log("body",req.body);
            res.end( JSON.stringify( created ) );
        });
    },
    postnews: function ( req, res, app, cb )
	{
       
        app.models[ "diputados" ].find().where( req.body.id ).exec(function (errfind, found){
            console.log("errfind:"+errfind,found);
            if (!errfind) {
            	_.forEach(found, function (val, key) {
				 	dip=val;
				});
		            dip.news.add(req.body.idn);
		            dip.save(function (error) {
						 console.log("error:"+error);
						 if (error) {
                            res.end( error );
                         }
                         else{
                            res.end( "added" );
                         }
					});
		            
            }
            
        });
    },
    postwork: function ( req, res, app, cb )
	{
        console.log("newser",req.body);
        app.models[ "diputados" ].find().where( req.body.id ).exec(function (errfind, found){
            console.log("errfind:"+errfind,found);
            if (!errfind && found.length>0) {
            	_.forEach(found, function (val, key) {
				 	dip=val;
				});
		            dip.work.add(req.body.idt);
		            dip.save(function (error) {
						 console.log("error:"+error);
                         if (error) {
                            res.end( error );
                         }
                         else{
                            res.end( "added" );
                         }
						 
					});
            }
            
        });
    },
	get: function apiGET ( req, res, app, cb )
	{

        console.log("geto",req.body.where);
        if (!req.body.where) {
            req.body.where={};
        }
		var q = app.models[ "diputados" ].find().where( req.body.where );//);
		if ( ! _.isEmpty( req.body.populate ) )
		{
			_.each( req.body.populate, function (p) {
				q.populate( p );
			} );
		}

		if ( ! _.isEmpty( req.body.paginate ) )
		{
			if ( ! _.isEmpty( req.body.paginate.page ) && ! _.isEmpty( req.body.paginate.limit ) )
				q.paginate( req.body.paginate.page, req.body.paginate.limit );
		}


		q.exec( function (err, theobject){
             console.log(err,theobject);
             if (req.body.bs) {
                app.models[ "bs" ].find({ where: {}, limit: 1, sort: 'date DESC' }).exec(function (err, bss){
                      if (err) {
                        console.log("err", err);
                      }
                      else{
                        res.end( JSON.stringify( {dip:theobject,bs:bss} ) );
                      }
                });
             }
             else{
                res.end( JSON.stringify( {dip:theobject} ) );
             }
			 
		} );
	},
	put: function apiPUT ( req, res, app, cb )
	{
		app.models[ "diputados" ].update(  req.body.id , req.body, function (err,doc ){ 
            console.log("err:"+err);
            console.log( JSON.stringify( doc ) );
            res.end( JSON.stringify( doc ) );
         });
	},
    del: function apiPUT ( req, res, app, cb )
    {
        app.models[ "diputados" ].destroy(  req.body.id , function (err,doc ){ 
            console.log("err:"+err);
            console.log( JSON.stringify( doc ) );
            res.end( JSON.stringify( doc ) );
         });
    },
    addMention: function ( req, res, app, cb )
    {
        app.models[ "diputados" ].find(  req.body.id , function (err,doc ){ 
            if (err) {res.end( JSON.stringify( err ) );}
            doc[0].news.add(req.body.idn);
            doc[0].save(function(err,res){
                res.end( JSON.stringify( res ) );
            });
            
         });
    }

};