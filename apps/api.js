
/*

	General purpose restful API.

	@body - all methods are posts.
	@body.model - required model name, returns statusCode 500 if model is not found.

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
    fill: function fill (req, res, app, cb){
            var sujetos=  [{infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=307",name:"Felipe de Jesús Romo Cuéllar"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=288",name:"Irma de Anda Licea"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=286",name:"Isaías Cortés Berumen"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=306",name:"María del Pilar Pérez Chavira"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=304",name:"Miguel Ángel Monraz Ibarra"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=301",name:"Antonio López Orózco"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=295",name:"Cecilia González Gómez"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=291",name:"Claudia Delgadillo González"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=279",name:"Edgar Oswaldo Bañales Orozco"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=284",name:"Hugo Contreras Zepeda"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=311",name:"Hugo René Ruíz Esparza Hermosillo"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=277",name:"Jorge Arana Arana"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=283",name:"Juana Ceballos Guzmán"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=305",name:"Liliana Guadalupe Morones Vargas"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=312",name:"María del Refugio Ruíz Moreno"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=285",name:"María del Rocío Corona Nakamura"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=280",name:"Martha Susana Barajas del Toro"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=278",name:"Salvador Arellano Guzmán"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=275",name:"Mónica Almeida López"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=292",name:"Saúl Galindo Plazola"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=289",name:"Enrique Aubry de Castro Palomino"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=308",name:"Erika Lizbeth Ramírez Pérez"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=298",name:"Omar Hernández Hernández"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=303",name:"Adriana Gabriela Medina Ortíz"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=313",name:"Augusto Valencia López"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=315",name:"Fela Patricia Pelayo López"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=297",name:"Héctor Alejandro Hermosillo González"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=310",name:"Hugo Rodríguez Díaz"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=290",name:"Ismael del Toro Castro"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=276",name:"Juan Carlos Anguiano Orozco"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=299",name:"Kehila Abigail Ku Escalante"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=316",name:"María de Lourdes Martínez Pizano"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=309",name:"María del Consuelo Robles Sierra"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=287",name:"María Elena de Anda Gutiérrez"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=282",name:"Mario Hugo Castellanos Ibarra"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=314",name:"Martha Villanueva Nuñez"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=296",name:"Ramón Demetrio Guerrero Martínez"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=293",name:"José García Mora"},
                        {infolejURL:"http://www.congresojal.gob.mx/diputados/perfil?id_dip=300",name:"José Pedro Kumamoto Aguilar"}];
        _.each(sujetos, function(sujeto, key) {
            app.models[ "diputados" ].create(sujeto).exec(function createCB(err, created){
                console.log("err:"+err);
                console.log( JSON.stringify( created ) );
            });
        });

    },
    test: function testdb ( req, res, app, cb )
	{
        //res.end( JSON.stringify( {miau:"dens"} ) );
        var q = app.models[ "diputados" ].find();
        q.exec( function (err, allTheStuff) {
            console.log("err:"+err);
            res.end( JSON.stringify( allTheStuff ) );
        });
    },
    post: function post ( req, res, app, cb )
	{
       
        app.models[ "diputados" ].create(req.body).exec(function createCB(err, created){
            console.log("err:"+err);
            res.end( JSON.stringify( created ) );
        });
        //res.end( JSON.stringify( {miau:"dens"} ) );
        //var q = app.models[ "diputados" ].find();
        //q.exec( function (err, allTheStuff) {
        //    console.log("err:"+err);
        //    res.end( JSON.stringify( allTheStuff ) );
        //});
    },
    postnews: function ( req, res, app, cb )
	{
       
        app.models[ "diputados" ].find().where( req.body.dip ).exec(function (errfind, found){
            console.log("errfind:"+errfind,found);
            if (!errfind) {
            	_.forEach(found, function (val, key) {
				 	dip=val;
				});
            	app.models[ "news" ].create(req.body.news).exec(function createCB(errnews, creatednews){
		            console.log("errnews:"+errnews);
		            dip.news.add(creatednews.id);
		            dip.save(function (error) {
						 console.log("error:"+error);
						 res.end( JSON.stringify( creatednews ) );
					});
		            
		        });
            }
            
        });
        //res.end( JSON.stringify( {miau:"dens"} ) );
        //var q = app.models[ "diputados" ].find();
        //q.exec( function (err, allTheStuff) {
        //    console.log("err:"+err);
        //    res.end( JSON.stringify( allTheStuff ) );
        //});
    },
	get: function apiGET ( req, res, app, cb )
	{
		var q = app.models[ "diputados" ].find().where( req.body.data );//);
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
	},
	put: function apiPUT ( req, res, app, cb )
	{

		var _l={};

		_l.check = function ( done )
		{

			if ( _.isUndefined( req.body ) ) return done( 'This is not a post?' );

			

			return done( null );

		};

		_l.do = [ 'check', function ( done )
		{

			if ( _.isArray ( req.body ) )
			{

				var _o=[];

				async.eachSeries( req.body.data, function ( item, next )
				{

					app.models[ "diputados" ].update( { id: req.body.id }, req.body , function( err, doc ) {

						if ( _.isEmpty( err ) ) _o.push( doc );

						else _o.push( [ err, item ] );

						next( null );

					} );

				}, function ( err ) {

					return done( err, _o );

				} );

			}

			else if ( _.isPlainObject( req.body ) )
			{
				console.log(req.body.name)
				app.models[ "diputados" ].update(  req.body.search , req.body.update, function (err,doc ){ 
					console.log("err:"+err);
                	console.log( JSON.stringify( doc ) );
                	res.end( JSON.stringify( doc ) );
				 });

			}

			else done( "Data should be Array or PlainObject" );

		} ];

		async.auto( _l, autoDone.bind( { res: res, app: app, cb: cb } ) );

	}

};