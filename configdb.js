
"use strict();";

var Waterline=require("waterline")
  , orm = new Waterline()
  , mysqlAdapter = require('sails-mysql')
  , mongoAdapter = require('sails-mongo')
  , config =
  {

    // Setup Adapters
    // Creates named adapters that have have been required
    adapters:
    {
      'default': mongoAdapter
      , mysql: mysqlAdapter
      , mongo: mongoAdapter
    },
    connections:
    {

      mysql: {
            adapter   : 'mysql',
            host      : 'localhost',
            port      : 3306,
            user      : 'root',
            password  : '',
            database  : 'BordeJal',
            charset   : 'utf8'
            // OR (explicit sets take precedence)
           // module    : 'sails-mysql',
            //url       : 'mysql2://USER:PASSWORD@HOST:PORT/DATABASENAME'

            // Optional
            //charset   : 'utf8'
            //collation : 'utf8_swedish_ci'
       },
       mongodb: {
        adapter: 'mongo',
        host: 'localhost', // defaults to `localhost` if omitted
        port: 27017, // defaults to 27017 if omitted
        database: 'BordeJal' // or omit if not relevant
      }

    },

    defaults:
    {
      migrate: process.env.NODE_ENV == 'development' ? 'alter' : 'safe'
    }

  };

var conn_default = "mongodb";

// Event
var diputados = Waterline.Collection.extend({
  identity: 'diputados',
  connection: conn_default,
  tableName: "diputados",
  attributes: {   
    id_dip: {
      type: 'integer'
    },
    idinfolej:{
      type: 'integer'
    },
    name: {
      type: 'string'
    },
    party: {
      type: 'string'
    },
    phone: {
      type: 'string'
    },
    mail: {
      type: 'string'
    },
    office: {
      type: 'string'
    },
    news: {
      collection: 'news',
      via: 'mentions',
      dominant:true
    },
    comision: {
      collection: 'comisiones',
      via: 'members',
    }
  }
});
orm.loadCollection(diputados);
var comisiones = Waterline.Collection.extend({
  identity: 'comisiones',
  connection: conn_default,
  tableName: "comisiones",
  attributes: {   
    name: {
      type: 'string',
    },
    members: {
      collection: 'diputados',
      via: 'comision',
      dominant:true
    }
  }
});
orm.loadCollection(comisiones);
var news = Waterline.Collection.extend({
  identity: 'news',
  connection: conn_default,
  tableName: "news",
  attributes: {   
    headline: {
      type: 'string',
    },
    resumed: {
      type: 'string',
    },
    source: {
      type: 'string',
    },
    link: {
      type: 'string'
    },
    mentions: {
      collection: 'diputados',
      via: 'news',
    }
  }
});
orm.loadCollection(news);
module.exports = function ( app )
{

  orm.initialize( config, function( err, models )
  {

    if(err) console.error(err);

    app.models = models.collections;
    app.connections = models.connections;

  });

  return app;

};