
/*

   Endpoint para añadir trabajo legislativo de forma manual

*/

"use strict();";


var _ = require('lodash')
    , async = require('async')
    , allowed = [ '_id',"ids", 'name' ]; // witch paths are allowed in the get request.

if (process.env.NODE_ENV=='development') console.log("Trabajo has loaded");



module.exports = module.export =
{
    get: function  ( req, res, app, cb )
    {
        var q = app.models[ "trabajo" ].find().where( req.body.where );//);
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
            console.log("err:"+err);
            res.end( JSON.stringify( allTheStuff ) );
        });
    },
    post: function  ( req, res, app, cb )
    {
        app.models[ "trabajo" ].create(req.body).exec(function createCB(err, created){
            console.log("err:"+err);
            res.end( JSON.stringify( created ) );
        });
    },
    del: function  ( req, res, app, cb )
    {
       
        app.models[ "trabajo" ].destroy(  req.body.id , function (err,doc ){ 
            console.log("errdel:"+err);
            res.end( JSON.stringify( doc ) );
         });
    }
};