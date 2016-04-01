
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

      // mysql: {
      //       adapter   : 'mysql',
      //       host      : 'localhost',
      //       port      : 3306,
      //       user      : 'root',
      //       password  : '',
      //       database  : 'BordeJal',
      //       charset   : 'utf8'
      //       // OR (explicit sets take precedence)
      //      // module    : 'sails-mysql',
      //       //url       : 'mysql2://USER:PASSWORD@HOST:PORT/DATABASENAME'

      //       // Optional
      //       //charset   : 'utf8'
      //       //collation : 'utf8_swedish_ci'
      //  },
      //  mongodb: {
      //   adapter: 'mongo',
      //   host: 'localhost', // defaults to `localhost` if omitted
      //   port: 27017, // defaults to 27017 if omitted
      //   database: 'BordeJal' // or omit if not relevant
      // },
      // remote: {
      //   adapter: 'mongo',
      //   host: 'apollo.modulusmongo.net', // defaults to `localhost` if omitted
      //   port: 27017, // defaults to 27017 if omitted
      //   database: 'inum8yJu', // or omit if not relevant
      //   user      : 'root',
      //       password  : '1234'
      // }
      local: {
        adapter: 'mongo',
        port: 27017, // defaults to 27017 if omitted
        database: 'bordeFed' // or omit if not relevant
        // user      : 'root',
        //     password  : '1234'
      }

    },

    defaults:
    {
      migrate: process.env.NODE_ENV == 'development' ? 'alter' : 'safe'
    }

  };

var conn_default = "local";

// Event
var diputados = Waterline.Collection.extend({
  identity: 'diputados',
  connection: conn_default,
  tableName: "diputados",
  attributes: {   
    id_dip: {
      type: 'integer'
    },
    crawlurl: {
      type: 'string' //url dl crawling de orígen
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
    type: {
      type: 'string'
    },
    gender: {
      type: 'string'
    },
    temas: {
      type: 'json'
    },
    facebook: {
      type: 'string'
    },
    twitter: {
      type: 'string'
    },
    eleccion: {
      type: 'string'  //RP,MR,PM
    },
    circunscripcion: {
      type: 'string'  
    },
    distrito: {
      type: 'string'  
    },
    camara: {
      type: 'string' //senadores, diputados
    },
    ordenDeGobierno: {
      type: 'string' //federal, estatal
    },
    estado: {
      type: 'string' //Jalisco, federal etc. 
    },
    news: {
      collection: 'news',
      via: 'mentions',
    },
    work: {
      collection: 'trabajo',
      via: 'author',
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
    namecom: {
      type: 'string',
    },
    puestocom: {
      type: 'string',
    },
    linkcom: {
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
var trabajo = Waterline.Collection.extend({
  identity: 'trabajo',
  connection: conn_default,
  tableName: "trabajo",
  attributes: {   
    estado: {
      type: 'string', //i || pda
    },
     fecha: {
      type: 'string',
    },
    type: {
      type: 'string',
    },
    resumen: {
      type: 'string',
    },
    subtype: {
      type: 'string',
    },
    origen: {
      type: 'string',
    },
    presentacion: {
      type: 'string',
    },
    title: {
      type: 'string'
    },
    link: {
      type: 'string',
    },
    com: {
      type: 'string',
    },
    author: {
      collection: 'diputados',
      via: 'work',
    },

  }
});
orm.loadCollection(trabajo);
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