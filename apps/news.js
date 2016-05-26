
/*

	Principal endpoint para acceder y modíficar noticias

*/

"use strict();";


var _ = require('lodash')
	, async = require('async')
	, allowed = [ '_id',"ids", 'name' ]; // witch paths are allowed in the get request.

if (process.env.NODE_ENV=='development') console.log("News has loaded");



module.exports = module.export =
{
    get: function  ( req, res, app, cb )
	{
        console.log("whers",req.body.where)
        var q = app.models[ "news" ].find().where( req.body.where );//);
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
        q.exec( function (err, allTheStuff) {
            console.log("err:"+err,allTheStuff);
            res.end( JSON.stringify( allTheStuff ) );
        });
    },
    post: function  ( req, res, app, cb )
	{
        //res.end( JSON.stringify( {miau:"dens"} ) );
        console.log("news",req.body)
        app.models[ "news" ].create(req.body).exec(function createCB(err, created){
            console.log("err:"+err);
            res.end( JSON.stringify( created ) );
        });
    },
    del: function  ( req, res, app, cb )
	{
       
        app.models[ "news" ].destroy(  req.body.id , function (err,doc ){ 
            console.log("errdel:"+err);
            res.end( JSON.stringify( doc ) );
         });
    }
};