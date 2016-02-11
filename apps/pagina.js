
/*

	General purpose restful API.

	@body - all methods are posts.
	@body.model - required model name, returns statusCode 500 if model is not found.

*/

"use strict();";


var _ = require('lodash')
	, async = require('async')
	, allowed = [ '_id',"ids", 'name' ]; // witch paths are allowed in the get request.

if (process.env.NODE_ENV=='development') console.log("pagina has loaded");

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
	portada: function apiGET ( req, res, app, cb )
	{
		var q = app.models[ "news" ].find({impact:"5"});//);
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
			 res.end( JSON.stringify( theobject ) );
		} );
	}

};