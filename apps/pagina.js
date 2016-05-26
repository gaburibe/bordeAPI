
/*

	Principal endpoint para servir a las páginas

*/

"use strict();";


var _ = require('lodash')
	, async = require('async')
	, allowed = [ '_id',"ids", 'name' ]; 

if (process.env.NODE_ENV=='development') console.log("Pagina has loaded");




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