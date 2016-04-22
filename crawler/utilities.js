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
var news_array=[
["Avalan en comisiones dictamen sobre suspensión de garantías; MORENA va en contra	","	Noticias MVS	","	3/29/2016	","	http://www.noticiasmvs.com/#!/noticias/avalan-en-comisiones-dictamen-sobre-suspension-de-garantias-morena-va-en-contra-928"],
["¿Diputados de 18 años de edad? Avanza la propuesta legislativa","	Excélsior	","	3/29/2016	","	http://www.excelsior.com.mx/nacional/2016/03/29/1083463		"],
["Senadores del PRD piden a gobierno de EPN sumarse a #MXcontraTrump	","	Economía Hoy	","	3/29/2016	","	http://www.economiahoy.mx/nacional-eAm-mx/noticias/7452778/03/16/Senadores-mexicanos-invitan-al-Gobierno-a-sumarse-a-su-campana-contra-Trump.html		"],
["Disciplina financiera “detonará” inversiones	","	Sol de México	","	3/24/2016	","	http://elsoldemexico.com.mx/finanzas/159320-disciplina-financiera-detonara-inversiones		"],
["Urge poner fin al abuso en el endeudamiento de estados y municipios: PAN	","	Excélsior	","	3/27/2016	","	http://www.excelsior.com.mx/nacional/2016/03/27/1083126		"],
["Diputados urgen a concretar leyes anticorrupción	","	El Financiero	","	3/28/2016	","	http://www.elfinanciero.com.mx/nacional/diputados-urgen-a-concretar-leyes-anticorrupcion.html		"],
["Senadores aprueban dictamen para reformar ley de APPs	","	La Jornada	","	3/17/2016	","	http://www.jornada.unam.mx/ultimas/2016/03/17/senadores-aprueban-dictamen-para-reformar-ley-de-apps-3396.html		"],
["Aprueban Ley de Asociaciones Público Privadas	","	Crónica	","	3/17/2016	","	http://www.cronica.com.mx/notas/2016/950848.html		"],
["Diputados de la comisión que investiga el caso Iguala se reunirán con Murillo Karam	","	SDP Noticias	","	3/30/2016	","	http://www.sdpnoticias.com/nacional/2016/03/30/diputados-de-la-comision-que-investiga-el-caso-iguala-se-reuniran-con-murillo-karam		"],
["GIEI debe continuar investigación: PAN	","	Excélsior	","	3/30/2016	","	http://www.excelsior.com.mx/nacional/2016/03/30/1083689		"],
["Senado rechaza tratar como urgente estrategia contra Trump	","	El Universal	","	3/30/2016	","	http://www.eluniversal.com.mx/articulo/nacion/politica/2016/03/30/senado-rechaza-tratar-como-urgente-estrategia-contra-trump		"],
["Diputados revisarán 140 leyes por desindexación del salario mínimo	","	El Financiero	","	3/30/2016	","	http://www.elfinanciero.com.mx/nacional/diputados-revisaran-140-leyes-por-desindexacion-del-salario-minimo.html?platform=hootsuite		"],
["Senadores piden a Gobierno Federal intervenga en Veracruz 	","	Radio Fórmula 	","	3/29/2016	","	http://www.radioformula.com.mx/notas.asp?Idn=582022&idFC=2016		"],
["Avanza reforma que permite estado de excepción	","	La Jornada	","	3/29/2016	","	http://www.jornada.unam.mx/ultimas/2016/03/29/avalan-diputados-reforma-que-permite-estado-de-excepcion-851.html		"],
["Senadores aducen baja en aprobación de EPN a mal manejo de problemas	","	El Universal	","	3/14/2016	","	http://www.eluniversal.com.mx/articulo/nacion/politica/2016/03/14/senadores-aducen-baja-en-aprobacion-de-epn-mal-manejo-de		"],
["Y ahora qué hacemos con el Mando Único	","	Animal Político	","	3/10/2016	","	http://www.animalpolitico.com/blogueros-el-blog-de-mexico-evalua/2016/03/10/que-hacemos-con-el-mando-unico/		"],
["El 6 de abril, reunión de diputados con Murillo Karam por caso Ayotzinapa	","	Aristegui Noticias	","	3/30/2016	","	http://aristeguinoticias.com/3003/mexico/el-6-de-abril-reunion-de-diputados-con-murillo-karam-por-caso-ayotzinapa/		"],
["Tunden a diputados del PRI que se subieron al Metro (Video)	","	Aristegui Noticias	","	3/18/2016	","	http://aristeguinoticias.com/1803/mexico/tunden-a-diputados-del-pri-que-se-subieron-al-metro-video/		"],
["Senadores que mueren de cáncer en LXII y LXIII legislaturas	","	Publimetro	","	3/15/2016	","	http://www.publimetro.com.mx/noticias/senadores-que-mueren-de-cancer-en-lxii-y-lxiii-legislaturas/mpco!HPT9EwWiaoGg/		"],
["Senado apoya a la UNAM para recuperar el auditorio \"Che Guevara\"	","	W Radio	","	3/12/2016	","	http://wradio.com.mx/radio/2016/03/12/nacional/1457749159_451653.html		"],
["Desayunan senadores con discapacitados	","	Reforma	","	3/15/2016	","	http://www.reforma.com/aplicaciones/articulo/default.aspx?Id=793976&v=3		"],
["Senadores pevemistas piden a diputados aprobar Ley de Calidad del Aire	","	20 Minutos	","	3/18/2016	","	http://www.20minutos.com.mx/noticia/74534/0/senadores-pevemistas-piden-a-diputados-aprobar-ley-de-calidad-del-aire/		"],
["Hacienda pide irse por la libre… el Congreso dice sí	","	Animal Político	","	3/17/2016	","	http://www.animalpolitico.com/blogueros-el-blog-de-mexico-evalua/2016/03/17/hacienda-pide-irse-por-la-libre-el-congreso-dice-si/		"],
["Diputados del PRI, PAN, PRD y PVEM se opusieron a modificar Ley de Transparencia	","	Revolución 3.0	","	3/30/2016	","	http://revoluciontrespuntocero.com/diputados-del-pri-pan-prd-y-pvem-se-opusieron-a-modificar-ley-de-transparencia/		"],
["Pese a recortes presupuestales, diputados se aumentarán este año 96 mdp para grupos parlamentarios	","	Revolución 3.0	","	3/28/2016	","	http://revoluciontrespuntocero.com/pese-a-recortes-presupuestales-diputados-se-aumentaran-este-ano-96-mdp-para-grupos-parlamentarios/		"],
["Fernando Yunes pide a Segob mandar al ejército y Marina a Veracruz	","	Milenio	","	3/29/2016	","	http://www.milenio.com/politica/Fernando_Yunes_Veracruz-violencia_Veracruz-delitos_Veracruz-militares_Veracruz_0_709729243.html		"],
["El PAN denuncia al Lozoya Austin ante la ASF por posibles actos de corrupción en Pemex	","	Sin Embargo	","	3/30/2016	","	http://www.sinembargo.mx/30-03-2016/1642267		"],
["Esperan diputados que precriterios económicos para 2017 sean realistas y responsables	","	Noticias MVS	","	3/29/2016	","	http://www.noticiasmvs.com/#!/noticias/esperan-diputados-que-precriterios-economicos-para-2017-sean-realistas-y-responsables-345		"],
["La Reforma Energética estás hundiendo a México: Dolores Padierna	","	Al Momento	","	3/18/2016	","	http://www.almomento.mx/la-reforma-energetica-estas-hundiendo-a-mexico-dolores-padierna/		"],
["Condena Gil Zuarth actos terroristas en Bélgica	","	Al Momento	","	3/22/2016	","	http://www.almomento.mx/condena-gil-zuarth-actos-terroristas-en-belgica/		"],
["Buscan con reforma desincentivar el “turismo reproductivo”	","	Proceso	","	3/22/2016	","	http://www.proceso.com.mx/434448/buscan-reforma-desincentivar-turismo-reproductivo		"],
["Acusa Morena a adversarios de continuar con la práctica de la “compra del voto”	","	Proceso	","	3/30/2016	","	http://www.proceso.com.mx/435170/acusa-morena-a-adversarios-continuar-la-practica-la-compra-del-voto		"],
["Camacho: Padres de los 43 no pueden comparecer en San Lázaro	","	Milenio	","	3/30/2016	","	http://www.milenio.com/politica/caso_ayotzinapa-padres_normalistas-caso_iguala-padres_43_camara_de_diputados_0_710329198.html		"],
["Senado pide a PGR informe sobre desaparecidos	","	SDP Noticias	","	3/30/2016	","	http://www.sdpnoticias.com/nacional/2016/03/30/senado-pide-a-pgr-informe-sobre-desaparecidos		"],
["Alistan controversia contra nueva Ley de desaparición	","	SDP Noticias	","	3/29/2016	","	http://www.sdpnoticias.com/nacional/2016/03/29/alistan-controversia-contra-nueva-ley-de-desaparicion		"],
["PRI, PAN y PRD aprueban dictamen que le permite al Presidente anular garantías individuales	","	Vanguardia	","	3/30/2016	","	http://www.vanguardia.com.mx/articulo/pri-pan-y-prd-aprueban-dictamen-que-le-permite-al-presidente-anular-garantias-individuales		"],
["Cámara de Diputados gasta 229 mdp en puros vales	","	Sopitas	","	3/28/2016	","	http://www.sopitas.com/597905-camara-diputados-vales-229-mdp/		"],
["Diputados aprueban dictamen que permite estado de excepción	","	Sopitas	","	3/30/2016	","	http://www.sopitas.com/598617-estado-de-excepcion-mexico-reforma-diputados/		"],
["En extraordinario, resolución sobre desafuero de diputada	","	Milenio	","	3/28/2016	","	http://www.milenio.com/politica/diputada_ligada_Chapo-Lucero_Guadlaupe_Sanchez-desafuero_Lucero_Sanchez_0_709129273.html		"],
["PRI en el Senado propone reformar financiamiento a partidos políticos	","	Noticias MVS 	","	3/31/2016	","	http://www.noticiasmvs.com/#!/noticias/pri-en-el-senado-propone-reformar-financiamiento-a-partidos-politicos-255		"],
["Diputados se pronuncian por ampliación del #HoyNoCircula	","	W Radio	","	3/31/2016	","	http://wradio.com.mx/radio/2016/03/31/nacional/1459452664_401029.html		"],
["Diputados del PRI impiden proyección de documental que exhibe al Ejército en caso Iguala	","	Sin Embargo	","	3/31/2016	","	http://www.sinembargo.mx/31-03-2016/1642639		"],
["Como muestra de solidaridad, el PAN propone comprar autos eléctricos para diputados	","	SDP Noticias	","	3/31/2016	","	http://www.sdpnoticias.com/nacional/2016/03/31/como-muestra-de-solidaridad-el-pan-propone-comprar-autos-electricos-para-diputados		"],
["Senado prevé avalar en abril leyes secundarias anticorrupción	","	Terra	","	3/31/2016	","	http://noticias.terra.com.mx/mexico/politica/senado-preve-avalar-en-abril-leyes-secundarias-anticorrupcion,387e75b1d00cdd2c3a63a52378ecca4agupmjxlh.html		"],
["Senadores se pronuncian contra violencia sexual en Veracruz	","	E-Consulta	","	3/31/2016	","	http://e-veracruz.mx/nota/2016-03-31/nacion/senadores-se-pronuncian-contra-violencia-sexual-en-veracruz		"],
["Murillo Karam se reunirá en privado con diputados por caso Ayotzinapa	","	Sopitas	","	3/31/2016	","	http://www.sopitas.com/598955-murillo-karam-ayotzinapa-diputados-giei/		"],
["Diputados aprueban ampliar servicios de salud en todo el país	","	Terra	","	3/31/2016	","	http://noticias.terra.com.mx/mexico/politica/diputados-aprueban-ampliar-servicios-de-salud-en-todo-el-pais,c7a141afd78b22eb39870ee91f4be288ztqs80ux.html		"],
["Senadores aprueban reforma para regular reproducción asistida 	","	Quadratín 	","	3/31/2016	","	https://www.quadratin.com.mx/politica/Senadores-aprueban-reforma-regular-reproduccion-asistida/		"],
["Analizan acciones para detectar a tiempo los “cánceres invisibles” 	","	20 Minutos	","	3/31/2016	","	http://www.20minutos.com.mx/noticia/78955/0/analizan-acciones-para-detectar-a-tiempo-los-canceres-invisibles/		"],
["No se votarán leyes anticorrupción sin iniciativa #3de3, advierte el  PAN	","	El financiero	","	3/31/2016	","	http://www.elfinanciero.com.mx/nacional/no-se-votaran-leyes-anticorrupcion-sin-iniciativa-3de3-advierte-el-pan.html		"]
];
var bscore={
	"57094160d444d42d03ce7573": {
		"medios": 0,
		"debate": 3,
		"inis": 0,
		"pas": 0,
		"asistencia": 18,
		"bs": {
			"bs1": 0.6857142857142857,
			"bs2": 0,
			"bs3": 0,
			"bs": 1,
			"asistencia": 0.2571428571428571,
			"inis": 0,
			"pas": 0,
			"debate": 0.42857142857142855,
			"r": 80,
			"r_pa": 48,
			"r_debate": 38,
			"r_ini": 48,
			"r_asistencia": 58
		}
	},
	"57094160d444d42d03ce7574": {
		"medios": 0,
		"debate": 0,
		"inis": 0,
		"pas": 0,
		"asistencia": 12,
		"bs": {
			"bs1": 0.17142857142857143,
			"bs2": 0,
			"bs3": 0,
			"bs": 1,
			"asistencia": 0.17142857142857143,
			"inis": 0,
			"pas": 0,
			"debate": 0,
			"r": 80,
			"r_pa": 48,
			"r_debate": 41,
			"r_ini": 48,
			"r_asistencia": 62
		}
	},
	"57094165d444d42d03ce7578": {
		"medios": 0,
		"debate": 0,
		"inis": 0,
		"pas": 0,
		"asistencia": 0,
		"bs": {
			"bs1": 0,
			"bs2": 0,
			"bs3": 0,
			"bs": 0,
			"asistencia": 0,
			"inis": 0,
			"pas": 0,
			"debate": 0,
			"r": 81,
			"r_pa": 48,
			"r_debate": 41,
			"r_ini": 48,
			"r_asistencia": 66
		}
	},
	"57094161d444d42d03ce7575": {
		"medios": 0,
		"debate": 20,
		"inis": 15,
		"pas": 15,
		"asistencia": 237,
		"bs": {
			"bs1": 66.24285714285715,
			"bs2": 0,
			"bs3": 0,
			"bs": 67,
			"asistencia": 3.3857142857142857,
			"inis": 45,
			"pas": 15,
			"debate": 2.857142857142857,
			"r": 44,
			"r_pa": 33,
			"r_debate": 21,
			"r_ini": 33,
			"r_asistencia": 13
		}
	},
	"57094163d444d42d03ce7576": {
		"medios": 0,
		"debate": 0,
		"inis": 0,
		"pas": 0,
		"asistencia": 18,
		"bs": {
			"bs1": 0.2571428571428571,
			"bs2": 0,
			"bs3": 0,
			"bs": 1,
			"asistencia": 0.2571428571428571,
			"inis": 0,
			"pas": 0,
			"debate": 0,
			"r": 80,
			"r_pa": 48,
			"r_debate": 41,
			"r_ini": 48,
			"r_asistencia": 58
		}
	},
	"57094165d444d42d03ce7577": {
		"medios": 0,
		"debate": 20,
		"inis": 6,
		"pas": 6,
		"asistencia": 212,
		"bs": {
			"bs1": 29.885714285714286,
			"bs2": 0,
			"bs3": 0,
			"bs": 30,
			"asistencia": 3.0285714285714285,
			"inis": 18,
			"pas": 6,
			"debate": 2.857142857142857,
			"r": 63,
			"r_pa": 42,
			"r_debate": 21,
			"r_ini": 42,
			"r_asistencia": 35
		}
	},
	"57094166d444d42d03ce7579": {
		"medios": 0,
		"debate": 17,
		"inis": 0,
		"pas": 0,
		"asistencia": 239,
		"bs": {
			"bs1": 5.8428571428571425,
			"bs2": 0,
			"bs3": 0,
			"bs": 6,
			"asistencia": 3.414285714285714,
			"inis": 0,
			"pas": 0,
			"debate": 2.4285714285714284,
			"r": 76,
			"r_pa": 48,
			"r_debate": 24,
			"r_ini": 48,
			"r_asistencia": 11
		}
	},
	"57094167d444d42d03ce757a": {
		"medios": 0,
		"debate": 1,
		"inis": 1,
		"pas": 1,
		"asistencia": 12,
		"bs": {
			"bs1": 4.314285714285715,
			"bs2": 0,
			"bs3": 0,
			"bs": 5,
			"asistencia": 0.17142857142857143,
			"inis": 3,
			"pas": 1,
			"debate": 0.14285714285714285,
			"r": 77,
			"r_pa": 47,
			"r_debate": 40,
			"r_ini": 47,
			"r_asistencia": 62
		}
	},
	"57094169d444d42d03ce757b": {
		"medios": 0,
		"debate": 0,
		"inis": 33,
		"pas": 33,
		"asistencia": 240,
		"bs": {
			"bs1": 135.42857142857142,
			"bs2": 0,
			"bs3": 0,
			"bs": 136,
			"asistencia": 3.4285714285714284,
			"inis": 99,
			"pas": 33,
			"debate": 0,
			"r": 23,
			"r_pa": 19,
			"r_debate": 41,
			"r_ini": 19,
			"r_asistencia": 10
		}
	},
	"5709416ed444d42d03ce757c": {
		"medios": 1,
		"debate": 8,
		"inis": 42,
		"pas": 42,
		"asistencia": 244,
		"bs": {
			"bs1": 172.62857142857143,
			"bs2": 0,
			"bs3": 0,
			"bs": 173,
			"asistencia": 3.4857142857142858,
			"inis": 126,
			"pas": 42,
			"debate": 1.1428571428571428,
			"r": 19,
			"r_pa": 15,
			"r_debate": 33,
			"r_ini": 15,
			"r_asistencia": 6
		}
	},
	"5709416ed444d42d03ce757e": {
		"medios": 0,
		"debate": 12,
		"inis": 5,
		"pas": 5,
		"asistencia": 231,
		"bs": {
			"bs1": 25.014285714285716,
			"bs2": 0,
			"bs3": 0,
			"bs": 26,
			"asistencia": 3.3,
			"inis": 15,
			"pas": 5,
			"debate": 1.7142857142857142,
			"r": 67,
			"r_pa": 43,
			"r_debate": 29,
			"r_ini": 43,
			"r_asistencia": 19
		}
	},
	"5709416ed444d42d03ce757d": {
		"medios": 0,
		"debate": 17,
		"inis": 28,
		"pas": 28,
		"asistencia": 221,
		"bs": {
			"bs1": 117.58571428571429,
			"bs2": 0,
			"bs3": 0,
			"bs": 118,
			"asistencia": 3.157142857142857,
			"inis": 84,
			"pas": 28,
			"debate": 2.4285714285714284,
			"r": 28,
			"r_pa": 23,
			"r_debate": 24,
			"r_ini": 23,
			"r_asistencia": 28
		}
	},
	"5709416fd444d42d03ce757f": {
		"medios": 0,
		"debate": 67,
		"inis": 68,
		"pas": 68,
		"asistencia": 229,
		"bs": {
			"bs1": 284.8428571428571,
			"bs2": 0,
			"bs3": 0,
			"bs": 285,
			"asistencia": 3.2714285714285714,
			"inis": 204,
			"pas": 68,
			"debate": 9.571428571428571,
			"r": 10,
			"r_pa": 8,
			"r_debate": 3,
			"r_ini": 8,
			"r_asistencia": 21
		}
	},
	"5709416fd444d42d03ce7580": {
		"medios": 0,
		"debate": 95,
		"inis": 0,
		"pas": 0,
		"asistencia": 233,
		"bs": {
			"bs1": 16.9,
			"bs2": 0,
			"bs3": 0,
			"bs": 17,
			"asistencia": 3.3285714285714287,
			"inis": 0,
			"pas": 0,
			"debate": 13.571428571428571,
			"r": 71,
			"r_pa": 48,
			"r_debate": 2,
			"r_ini": 48,
			"r_asistencia": 17
		}
	},
	"5709416fd444d42d03ce7581": {
		"medios": 0,
		"debate": 11,
		"inis": 17,
		"pas": 17,
		"asistencia": 231,
		"bs": {
			"bs1": 72.87142857142857,
			"bs2": 0,
			"bs3": 0,
			"bs": 73,
			"asistencia": 3.3,
			"inis": 51,
			"pas": 17,
			"debate": 1.5714285714285714,
			"r": 40,
			"r_pa": 31,
			"r_debate": 30,
			"r_ini": 31,
			"r_asistencia": 19
		}
	},
	"5709416fd444d42d03ce7583": {
		"medios": 0,
		"debate": 0,
		"inis": 17,
		"pas": 17,
		"asistencia": 220,
		"bs": {
			"bs1": 71.14285714285714,
			"bs2": 0,
			"bs3": 0,
			"bs": 72,
			"asistencia": 3.142857142857143,
			"inis": 51,
			"pas": 17,
			"debate": 0,
			"r": 41,
			"r_pa": 31,
			"r_debate": 41,
			"r_ini": 31,
			"r_asistencia": 29
		}
	},
	"5709416fd444d42d03ce7584": {
		"medios": 0,
		"debate": 26,
		"inis": 56,
		"pas": 56,
		"asistencia": 215,
		"bs": {
			"bs1": 230.7857142857143,
			"bs2": 0,
			"bs3": 0,
			"bs": 231,
			"asistencia": 3.0714285714285716,
			"inis": 168,
			"pas": 56,
			"debate": 3.7142857142857144,
			"r": 15,
			"r_pa": 12,
			"r_debate": 16,
			"r_ini": 12,
			"r_asistencia": 33
		}
	},
	"5709416fd444d42d03ce7582": {
		"medios": 0,
		"debate": 0,
		"inis": 0,
		"pas": 0,
		"asistencia": 224,
		"bs": {
			"bs1": 3.2,
			"bs2": 0,
			"bs3": 0,
			"bs": 4,
			"asistencia": 3.2,
			"inis": 0,
			"pas": 0,
			"debate": 0,
			"r": 78,
			"r_pa": 48,
			"r_debate": 41,
			"r_ini": 48,
			"r_asistencia": 26
		}
	},
	"5709416fd444d42d03ce7585": {
		"medios": 1,
		"debate": 32,
		"inis": 13,
		"pas": 13,
		"asistencia": 239,
		"bs": {
			"bs1": 59.98571428571428,
			"bs2": 0,
			"bs3": 0,
			"bs": 60,
			"asistencia": 3.414285714285714,
			"inis": 39,
			"pas": 13,
			"debate": 4.571428571428571,
			"r": 48,
			"r_pa": 35,
			"r_debate": 11,
			"r_ini": 35,
			"r_asistencia": 11
		}
	},
	"57094170d444d42d03ce7586": {
		"medios": 0,
		"debate": 0,
		"inis": 87,
		"pas": 87,
		"asistencia": 239,
		"bs": {
			"bs1": 351.4142857142857,
			"bs2": 0,
			"bs3": 0,
			"bs": 352,
			"asistencia": 3.414285714285714,
			"inis": 261,
			"pas": 87,
			"debate": 0,
			"r": 6,
			"r_pa": 5,
			"r_debate": 41,
			"r_ini": 5,
			"r_asistencia": 11
		}
	},
	"57094172d444d42d03ce7587": {
		"medios": 0,
		"debate": 9,
		"inis": 6,
		"pas": 6,
		"asistencia": 64,
		"bs": {
			"bs1": 26.2,
			"bs2": 0,
			"bs3": 0,
			"bs": 27,
			"asistencia": 0.9142857142857143,
			"inis": 18,
			"pas": 6,
			"debate": 1.2857142857142858,
			"r": 66,
			"r_pa": 42,
			"r_debate": 32,
			"r_ini": 42,
			"r_asistencia": 52
		}
	},
	"570946dd67ee364103b9a5b5": {
		"medios": 0,
		"debate": 2,
		"inis": 1,
		"pas": 1,
		"asistencia": 8,
		"bs": {
			"bs1": 4.3999999999999995,
			"bs2": 0,
			"bs3": 0,
			"bs": 5,
			"asistencia": 0.11428571428571428,
			"inis": 3,
			"pas": 1,
			"debate": 0.2857142857142857,
			"r": 77,
			"r_pa": 47,
			"r_debate": 39,
			"r_ini": 47,
			"r_asistencia": 65
		}
	},
	"570946dd67ee364103b9a5b8": {
		"medios": 0,
		"debate": 1,
		"inis": 0,
		"pas": 0,
		"asistencia": 37,
		"bs": {
			"bs1": 0.6714285714285715,
			"bs2": 0,
			"bs3": 0,
			"bs": 1,
			"asistencia": 0.5285714285714286,
			"inis": 0,
			"pas": 0,
			"debate": 0.14285714285714285,
			"r": 80,
			"r_pa": 48,
			"r_debate": 40,
			"r_ini": 48,
			"r_asistencia": 55
		}
	},
	"570946e767ee364103b9a5c6": {
		"medios": 0,
		"debate": 1,
		"inis": 0,
		"pas": 0,
		"asistencia": 16,
		"bs": {
			"bs1": 0.37142857142857144,
			"bs2": 0,
			"bs3": 0,
			"bs": 1,
			"asistencia": 0.22857142857142856,
			"inis": 0,
			"pas": 0,
			"debate": 0.14285714285714285,
			"r": 80,
			"r_pa": 48,
			"r_debate": 40,
			"r_ini": 48,
			"r_asistencia": 59
		}
	},
	"57094172d444d42d03ce7588": {
		"medios": 0,
		"debate": 0,
		"inis": 22,
		"pas": 22,
		"asistencia": 228,
		"bs": {
			"bs1": 91.25714285714285,
			"bs2": 0,
			"bs3": 0,
			"bs": 92,
			"asistencia": 3.257142857142857,
			"inis": 66,
			"pas": 22,
			"debate": 0,
			"r": 35,
			"r_pa": 27,
			"r_debate": 41,
			"r_ini": 27,
			"r_asistencia": 22
		}
	},
	"57094172d444d42d03ce7589": {
		"medios": 0,
		"debate": 0,
		"inis": 0,
		"pas": 0,
		"asistencia": 226,
		"bs": {
			"bs1": 3.2285714285714286,
			"bs2": 0,
			"bs3": 0,
			"bs": 4,
			"asistencia": 3.2285714285714286,
			"inis": 0,
			"pas": 0,
			"debate": 0,
			"r": 78,
			"r_pa": 48,
			"r_debate": 41,
			"r_ini": 48,
			"r_asistencia": 24
		}
	},
	"57094172d444d42d03ce758a": {
		"medios": 0,
		"debate": 6,
		"inis": 0,
		"pas": 0,
		"asistencia": 232,
		"bs": {
			"bs1": 4.171428571428572,
			"bs2": 0,
			"bs3": 0,
			"bs": 5,
			"asistencia": 3.3142857142857145,
			"inis": 0,
			"pas": 0,
			"debate": 0.8571428571428571,
			"r": 77,
			"r_pa": 48,
			"r_debate": 35,
			"r_ini": 48,
			"r_asistencia": 18
		}
	},
	"57094172d444d42d03ce758b": {
		"medios": 1,
		"debate": 14,
		"inis": 32,
		"pas": 32,
		"asistencia": 205,
		"bs": {
			"bs1": 132.92857142857142,
			"bs2": 0,
			"bs3": 0,
			"bs": 133,
			"asistencia": 2.9285714285714284,
			"inis": 96,
			"pas": 32,
			"debate": 2,
			"r": 24,
			"r_pa": 20,
			"r_debate": 27,
			"r_ini": 20,
			"r_asistencia": 40
		}
	},
	"57094172d444d42d03ce758c": {
		"medios": 1,
		"debate": 9,
		"inis": 2,
		"pas": 2,
		"asistencia": 246,
		"bs": {
			"bs1": 12.8,
			"bs2": 0,
			"bs3": 0,
			"bs": 13,
			"asistencia": 3.5142857142857142,
			"inis": 6,
			"pas": 2,
			"debate": 1.2857142857142858,
			"r": 73,
			"r_pa": 46,
			"r_debate": 32,
			"r_ini": 46,
			"r_asistencia": 5
		}
	},
	"57094172d444d42d03ce7590": {
		"medios": 0,
		"debate": 10,
		"inis": 12,
		"pas": 12,
		"asistencia": 202,
		"bs": {
			"bs1": 52.31428571428572,
			"bs2": 0,
			"bs3": 0,
			"bs": 53,
			"asistencia": 2.8857142857142857,
			"inis": 36,
			"pas": 12,
			"debate": 1.4285714285714286,
			"r": 51,
			"r_pa": 36,
			"r_debate": 31,
			"r_ini": 36,
			"r_asistencia": 41
		}
	},
	"57094172d444d42d03ce7591": {
		"medios": 0,
		"debate": 5,
		"inis": 19,
		"pas": 19,
		"asistencia": 233,
		"bs": {
			"bs1": 80.04285714285713,
			"bs2": 0,
			"bs3": 0,
			"bs": 81,
			"asistencia": 3.3285714285714287,
			"inis": 57,
			"pas": 19,
			"debate": 0.7142857142857143,
			"r": 38,
			"r_pa": 30,
			"r_debate": 36,
			"r_ini": 30,
			"r_asistencia": 17
		}
	},
	"57094172d444d42d03ce7596": {
		"medios": 0,
		"debate": 12,
		"inis": 41,
		"pas": 41,
		"asistencia": 202,
		"bs": {
			"bs1": 168.6,
			"bs2": 0,
			"bs3": 0,
			"bs": 169,
			"asistencia": 2.8857142857142857,
			"inis": 123,
			"pas": 41,
			"debate": 1.7142857142857142,
			"r": 20,
			"r_pa": 16,
			"r_debate": 29,
			"r_ini": 16,
			"r_asistencia": 41
		}
	},
	"57094172d444d42d03ce758d": {
		"medios": 1,
		"debate": 13,
		"inis": 31,
		"pas": 31,
		"asistencia": 235,
		"bs": {
			"bs1": 129.21428571428572,
			"bs2": 0,
			"bs3": 0,
			"bs": 130,
			"asistencia": 3.357142857142857,
			"inis": 93,
			"pas": 31,
			"debate": 1.8571428571428572,
			"r": 25,
			"r_pa": 21,
			"r_debate": 28,
			"r_ini": 21,
			"r_asistencia": 15
		}
	},
	"57094172d444d42d03ce758e": {
		"medios": 0,
		"debate": 23,
		"inis": 23,
		"pas": 23,
		"asistencia": 151,
		"bs": {
			"bs1": 97.44285714285715,
			"bs2": 0,
			"bs3": 0,
			"bs": 98,
			"asistencia": 2.157142857142857,
			"inis": 69,
			"pas": 23,
			"debate": 3.2857142857142856,
			"r": 32,
			"r_pa": 26,
			"r_debate": 19,
			"r_ini": 26,
			"r_asistencia": 48
		}
	},
	"57094172d444d42d03ce7593": {
		"medios": 0,
		"debate": 21,
		"inis": 17,
		"pas": 17,
		"asistencia": 233,
		"bs": {
			"bs1": 74.32857142857142,
			"bs2": 0,
			"bs3": 0,
			"bs": 75,
			"asistencia": 3.3285714285714287,
			"inis": 51,
			"pas": 17,
			"debate": 3,
			"r": 39,
			"r_pa": 31,
			"r_debate": 20,
			"r_ini": 31,
			"r_asistencia": 17
		}
	},
	"57094172d444d42d03ce758f": {
		"medios": 1,
		"debate": 48,
		"inis": 12,
		"pas": 12,
		"asistencia": 242,
		"bs": {
			"bs1": 58.31428571428571,
			"bs2": 0,
			"bs3": 0,
			"bs": 59,
			"asistencia": 3.4571428571428573,
			"inis": 36,
			"pas": 12,
			"debate": 6.857142857142857,
			"r": 49,
			"r_pa": 36,
			"r_debate": 6,
			"r_ini": 36,
			"r_asistencia": 8
		}
	},
	"57094172d444d42d03ce7594": {
		"medios": 0,
		"debate": 7,
		"inis": 2,
		"pas": 2,
		"asistencia": 220,
		"bs": {
			"bs1": 12.142857142857142,
			"bs2": 0,
			"bs3": 0,
			"bs": 13,
			"asistencia": 3.142857142857143,
			"inis": 6,
			"pas": 2,
			"debate": 1,
			"r": 73,
			"r_pa": 46,
			"r_debate": 34,
			"r_ini": 46,
			"r_asistencia": 29
		}
	},
	"57094172d444d42d03ce7595": {
		"medios": 0,
		"debate": 0,
		"inis": 25,
		"pas": 25,
		"asistencia": 219,
		"bs": {
			"bs1": 103.12857142857143,
			"bs2": 0,
			"bs3": 0,
			"bs": 104,
			"asistencia": 3.1285714285714286,
			"inis": 75,
			"pas": 25,
			"debate": 0,
			"r": 30,
			"r_pa": 24,
			"r_debate": 41,
			"r_ini": 24,
			"r_asistencia": 30
		}
	},
	"57094172d444d42d03ce7598": {
		"medios": 0,
		"debate": 10,
		"inis": 16,
		"pas": 16,
		"asistencia": 234,
		"bs": {
			"bs1": 68.77142857142857,
			"bs2": 0,
			"bs3": 0,
			"bs": 69,
			"asistencia": 3.342857142857143,
			"inis": 48,
			"pas": 16,
			"debate": 1.4285714285714286,
			"r": 42,
			"r_pa": 32,
			"r_debate": 31,
			"r_ini": 32,
			"r_asistencia": 16
		}
	},
	"57094172d444d42d03ce7592": {
		"medios": 0,
		"debate": 4,
		"inis": 2,
		"pas": 2,
		"asistencia": 246,
		"bs": {
			"bs1": 12.085714285714285,
			"bs2": 0,
			"bs3": 0,
			"bs": 13,
			"asistencia": 3.5142857142857142,
			"inis": 6,
			"pas": 2,
			"debate": 0.5714285714285714,
			"r": 73,
			"r_pa": 46,
			"r_debate": 37,
			"r_ini": 46,
			"r_asistencia": 5
		}
	},
	"57094172d444d42d03ce7597": {
		"medios": 1,
		"debate": 8,
		"inis": 23,
		"pas": 23,
		"asistencia": 231,
		"bs": {
			"bs1": 96.44285714285714,
			"bs2": 0,
			"bs3": 0,
			"bs": 97,
			"asistencia": 3.3,
			"inis": 69,
			"pas": 23,
			"debate": 1.1428571428571428,
			"r": 33,
			"r_pa": 26,
			"r_debate": 33,
			"r_ini": 26,
			"r_asistencia": 19
		}
	},
	"570946dd67ee364103b9a5b9": {
		"medios": 0,
		"debate": 1,
		"inis": 0,
		"pas": 0,
		"asistencia": 12,
		"bs": {
			"bs1": 0.3142857142857143,
			"bs2": 0,
			"bs3": 0,
			"bs": 1,
			"asistencia": 0.17142857142857143,
			"inis": 0,
			"pas": 0,
			"debate": 0.14285714285714285,
			"r": 80,
			"r_pa": 48,
			"r_debate": 40,
			"r_ini": 48,
			"r_asistencia": 62
		}
	},
	"570946dd67ee364103b9a5b6": {
		"medios": 0,
		"debate": 7,
		"inis": 29,
		"pas": 29,
		"asistencia": 241,
		"bs": {
			"bs1": 120.44285714285715,
			"bs2": 0,
			"bs3": 0,
			"bs": 121,
			"asistencia": 3.442857142857143,
			"inis": 87,
			"pas": 29,
			"debate": 1,
			"r": 27,
			"r_pa": 22,
			"r_debate": 34,
			"r_ini": 22,
			"r_asistencia": 9
		}
	},
	"570946dd67ee364103b9a5b7": {
		"medios": 0,
		"debate": 6,
		"inis": 7,
		"pas": 7,
		"asistencia": 231,
		"bs": {
			"bs1": 32.15714285714286,
			"bs2": 0,
			"bs3": 0,
			"bs": 33,
			"asistencia": 3.3,
			"inis": 21,
			"pas": 7,
			"debate": 0.8571428571428571,
			"r": 60,
			"r_pa": 41,
			"r_debate": 35,
			"r_ini": 41,
			"r_asistencia": 19
		}
	},
	"570946dd67ee364103b9a5bb": {
		"medios": 0,
		"debate": 2,
		"inis": 0,
		"pas": 0,
		"asistencia": 14,
		"bs": {
			"bs1": 0.4857142857142857,
			"bs2": 0,
			"bs3": 0,
			"bs": 1,
			"asistencia": 0.2,
			"inis": 0,
			"pas": 0,
			"debate": 0.2857142857142857,
			"r": 80,
			"r_pa": 48,
			"r_debate": 39,
			"r_ini": 48,
			"r_asistencia": 60
		}
	},
	"570946dd67ee364103b9a5ba": {
		"medios": 1,
		"debate": 21,
		"inis": 6,
		"pas": 6,
		"asistencia": 234,
		"bs": {
			"bs1": 30.34285714285714,
			"bs2": 0,
			"bs3": 0,
			"bs": 31,
			"asistencia": 3.342857142857143,
			"inis": 18,
			"pas": 6,
			"debate": 3,
			"r": 62,
			"r_pa": 42,
			"r_debate": 20,
			"r_ini": 42,
			"r_asistencia": 16
		}
	},
	"570946dd67ee364103b9a5bc": {
		"medios": 1,
		"debate": 25,
		"inis": 21,
		"pas": 21,
		"asistencia": 242,
		"bs": {
			"bs1": 91.02857142857142,
			"bs2": 0,
			"bs3": 0,
			"bs": 92,
			"asistencia": 3.4571428571428573,
			"inis": 63,
			"pas": 21,
			"debate": 3.5714285714285716,
			"r": 35,
			"r_pa": 28,
			"r_debate": 17,
			"r_ini": 28,
			"r_asistencia": 8
		}
	},
	"570946dd67ee364103b9a5be": {
		"medios": 1,
		"debate": 0,
		"inis": 72,
		"pas": 72,
		"asistencia": 248,
		"bs": {
			"bs1": 291.54285714285714,
			"bs2": 0,
			"bs3": 0,
			"bs": 292,
			"asistencia": 3.5428571428571427,
			"inis": 216,
			"pas": 72,
			"debate": 0,
			"r": 9,
			"r_pa": 7,
			"r_debate": 41,
			"r_ini": 7,
			"r_asistencia": 4
		}
	},
	"570946dd67ee364103b9a5bd": {
		"medios": 0,
		"debate": 36,
		"inis": 107,
		"pas": 107,
		"asistencia": 224,
		"bs": {
			"bs1": 436.34285714285716,
			"bs2": 0,
			"bs3": 0,
			"bs": 437,
			"asistencia": 3.2,
			"inis": 321,
			"pas": 107,
			"debate": 5.142857142857143,
			"r": 3,
			"r_pa": 3,
			"r_debate": 9,
			"r_ini": 3,
			"r_asistencia": 26
		}
	},
	"570946de67ee364103b9a5bf": {
		"medios": 0,
		"debate": 12,
		"inis": 58,
		"pas": 58,
		"asistencia": 187,
		"bs": {
			"bs1": 236.3857142857143,
			"bs2": 0,
			"bs3": 0,
			"bs": 237,
			"asistencia": 2.6714285714285713,
			"inis": 174,
			"pas": 58,
			"debate": 1.7142857142857142,
			"r": 14,
			"r_pa": 11,
			"r_debate": 29,
			"r_ini": 11,
			"r_asistencia": 44
		}
	},
	"570946de67ee364103b9a5c0": {
		"medios": 0,
		"debate": 8,
		"inis": 164,
		"pas": 164,
		"asistencia": 213,
		"bs": {
			"bs1": 660.1857142857142,
			"bs2": 0,
			"bs3": 0,
			"bs": 661,
			"asistencia": 3.0428571428571427,
			"inis": 492,
			"pas": 164,
			"debate": 1.1428571428571428,
			"r": 0,
			"r_pa": 0,
			"r_debate": 33,
			"r_ini": 0,
			"r_asistencia": 34
		}
	},
	"570946e567ee364103b9a5c1": {
		"medios": 0,
		"debate": 48,
		"inis": 66,
		"pas": 66,
		"asistencia": 224,
		"bs": {
			"bs1": 274.0571428571428,
			"bs2": 0,
			"bs3": 0,
			"bs": 275,
			"asistencia": 3.2,
			"inis": 198,
			"pas": 66,
			"debate": 6.857142857142857,
			"r": 11,
			"r_pa": 9,
			"r_debate": 6,
			"r_ini": 9,
			"r_asistencia": 26
		}
	},
	"570946e667ee364103b9a5c2": {
		"medios": 0,
		"debate": 11,
		"inis": 158,
		"pas": 158,
		"asistencia": 246,
		"bs": {
			"bs1": 637.0857142857143,
			"bs2": 0,
			"bs3": 0,
			"bs": 638,
			"asistencia": 3.5142857142857142,
			"inis": 474,
			"pas": 158,
			"debate": 1.5714285714285714,
			"r": 2,
			"r_pa": 2,
			"r_debate": 30,
			"r_ini": 2,
			"r_asistencia": 5
		}
	},
	"570946e667ee364103b9a5c3": {
		"medios": 0,
		"debate": 5,
		"inis": 10,
		"pas": 10,
		"asistencia": 227,
		"bs": {
			"bs1": 43.957142857142856,
			"bs2": 0,
			"bs3": 0,
			"bs": 44,
			"asistencia": 3.242857142857143,
			"inis": 30,
			"pas": 10,
			"debate": 0.7142857142857143,
			"r": 54,
			"r_pa": 38,
			"r_debate": 36,
			"r_ini": 38,
			"r_asistencia": 23
		}
	},
	"570946e767ee364103b9a5c7": {
		"medios": 0,
		"debate": 0,
		"inis": 6,
		"pas": 6,
		"asistencia": 233,
		"bs": {
			"bs1": 27.32857142857143,
			"bs2": 0,
			"bs3": 0,
			"bs": 28,
			"asistencia": 3.3285714285714287,
			"inis": 18,
			"pas": 6,
			"debate": 0,
			"r": 65,
			"r_pa": 42,
			"r_debate": 41,
			"r_ini": 42,
			"r_asistencia": 17
		}
	},
	"570946e767ee364103b9a5c5": {
		"medios": 0,
		"debate": 30,
		"inis": 8,
		"pas": 8,
		"asistencia": 233,
		"bs": {
			"bs1": 39.614285714285714,
			"bs2": 0,
			"bs3": 0,
			"bs": 40,
			"asistencia": 3.3285714285714287,
			"inis": 24,
			"pas": 8,
			"debate": 4.285714285714286,
			"r": 58,
			"r_pa": 40,
			"r_debate": 12,
			"r_ini": 40,
			"r_asistencia": 17
		}
	},
	"570946e767ee364103b9a5c4": {
		"medios": 0,
		"debate": 35,
		"inis": 60,
		"pas": 60,
		"asistencia": 233,
		"bs": {
			"bs1": 248.32857142857142,
			"bs2": 0,
			"bs3": 0,
			"bs": 249,
			"asistencia": 3.3285714285714287,
			"inis": 180,
			"pas": 60,
			"debate": 5,
			"r": 13,
			"r_pa": 10,
			"r_debate": 10,
			"r_ini": 10,
			"r_asistencia": 17
		}
	},
	"570946e867ee364103b9a5c8": {
		"medios": 0,
		"debate": 9,
		"inis": 14,
		"pas": 14,
		"asistencia": 177,
		"bs": {
			"bs1": 59.81428571428571,
			"bs2": 0,
			"bs3": 0,
			"bs": 60,
			"asistencia": 2.5285714285714285,
			"inis": 42,
			"pas": 14,
			"debate": 1.2857142857142858,
			"r": 48,
			"r_pa": 34,
			"r_debate": 32,
			"r_ini": 34,
			"r_asistencia": 45
		}
	},
	"570946e867ee364103b9a5c9": {
		"medios": 0,
		"debate": 19,
		"inis": 53,
		"pas": 53,
		"asistencia": 233,
		"bs": {
			"bs1": 218.04285714285714,
			"bs2": 0,
			"bs3": 0,
			"bs": 219,
			"asistencia": 3.3285714285714287,
			"inis": 159,
			"pas": 53,
			"debate": 2.7142857142857144,
			"r": 17,
			"r_pa": 13,
			"r_debate": 22,
			"r_ini": 13,
			"r_asistencia": 17
		}
	},
	"570946e967ee364103b9a5ca": {
		"medios": 0,
		"debate": 47,
		"inis": 60,
		"pas": 60,
		"asistencia": 243,
		"bs": {
			"bs1": 250.18571428571428,
			"bs2": 0,
			"bs3": 0,
			"bs": 251,
			"asistencia": 3.4714285714285715,
			"inis": 180,
			"pas": 60,
			"debate": 6.714285714285714,
			"r": 12,
			"r_pa": 10,
			"r_debate": 7,
			"r_ini": 10,
			"r_asistencia": 7
		}
	},
	"570946ea67ee364103b9a5cc": {
		"medios": 0,
		"debate": 9,
		"inis": 15,
		"pas": 15,
		"asistencia": 240,
		"bs": {
			"bs1": 64.71428571428572,
			"bs2": 0,
			"bs3": 0,
			"bs": 65,
			"asistencia": 3.4285714285714284,
			"inis": 45,
			"pas": 15,
			"debate": 1.2857142857142858,
			"r": 46,
			"r_pa": 33,
			"r_debate": 32,
			"r_ini": 33,
			"r_asistencia": 10
		}
	},
	"570946eb67ee364103b9a5cd": {
		"medios": 0,
		"debate": 27,
		"inis": 22,
		"pas": 22,
		"asistencia": 213,
		"bs": {
			"bs1": 94.9,
			"bs2": 0,
			"bs3": 0,
			"bs": 95,
			"asistencia": 3.0428571428571427,
			"inis": 66,
			"pas": 22,
			"debate": 3.857142857142857,
			"r": 34,
			"r_pa": 27,
			"r_debate": 15,
			"r_ini": 27,
			"r_asistencia": 34
		}
	},
	"570946eb67ee364103b9a5ce": {
		"medios": 0,
		"debate": 7,
		"inis": 15,
		"pas": 15,
		"asistencia": 229,
		"bs": {
			"bs1": 64.27142857142857,
			"bs2": 0,
			"bs3": 0,
			"bs": 65,
			"asistencia": 3.2714285714285714,
			"inis": 45,
			"pas": 15,
			"debate": 1,
			"r": 46,
			"r_pa": 33,
			"r_debate": 34,
			"r_ini": 33,
			"r_asistencia": 21
		}
	},
	"570946ec67ee364103b9a5cf": {
		"medios": 0,
		"debate": 4,
		"inis": 3,
		"pas": 3,
		"asistencia": 209,
		"bs": {
			"bs1": 15.557142857142857,
			"bs2": 0,
			"bs3": 0,
			"bs": 16,
			"asistencia": 2.9857142857142858,
			"inis": 9,
			"pas": 3,
			"debate": 0.5714285714285714,
			"r": 72,
			"r_pa": 45,
			"r_debate": 37,
			"r_ini": 45,
			"r_asistencia": 37
		}
	},
	"570946ec67ee364103b9a5d0": {
		"medios": 0,
		"debate": 16,
		"inis": 39,
		"pas": 39,
		"asistencia": 211,
		"bs": {
			"bs1": 161.29999999999998,
			"bs2": 0,
			"bs3": 0,
			"bs": 162,
			"asistencia": 3.0142857142857142,
			"inis": 117,
			"pas": 39,
			"debate": 2.2857142857142856,
			"r": 21,
			"r_pa": 17,
			"r_debate": 25,
			"r_ini": 17,
			"r_asistencia": 36
		}
	},
	"570946ec67ee364103b9a5d1": {
		"medios": 0,
		"debate": 21,
		"inis": 34,
		"pas": 34,
		"asistencia": 234,
		"bs": {
			"bs1": 142.34285714285716,
			"bs2": 0,
			"bs3": 0,
			"bs": 143,
			"asistencia": 3.342857142857143,
			"inis": 102,
			"pas": 34,
			"debate": 3,
			"r": 22,
			"r_pa": 18,
			"r_debate": 20,
			"r_ini": 18,
			"r_asistencia": 16
		}
	},
	"570946ec67ee364103b9a5d2": {
		"medios": 0,
		"debate": 0,
		"inis": 14,
		"pas": 14,
		"asistencia": 206,
		"bs": {
			"bs1": 58.94285714285714,
			"bs2": 0,
			"bs3": 0,
			"bs": 59,
			"asistencia": 2.942857142857143,
			"inis": 42,
			"pas": 14,
			"debate": 0,
			"r": 49,
			"r_pa": 34,
			"r_debate": 41,
			"r_ini": 34,
			"r_asistencia": 39
		}
	},
	"570949ebece68a4403c1128d": {
		"medios": 0,
		"debate": 4,
		"inis": 0,
		"pas": 0,
		"asistencia": 20,
		"bs": {
			"bs1": 0.8571428571428571,
			"bs2": 0,
			"bs3": 0,
			"bs": 1,
			"asistencia": 0.2857142857142857,
			"inis": 0,
			"pas": 0,
			"debate": 0.5714285714285714,
			"r": 80,
			"r_pa": 48,
			"r_debate": 37,
			"r_ini": 48,
			"r_asistencia": 56
		}
	},
	"570949ebece68a4403c1128e": {
		"medios": 0,
		"debate": 1,
		"inis": 0,
		"pas": 0,
		"asistencia": 16,
		"bs": {
			"bs1": 0.37142857142857144,
			"bs2": 0,
			"bs3": 0,
			"bs": 1,
			"asistencia": 0.22857142857142856,
			"inis": 0,
			"pas": 0,
			"debate": 0.14285714285714285,
			"r": 80,
			"r_pa": 48,
			"r_debate": 40,
			"r_ini": 48,
			"r_asistencia": 59
		}
	},
	"570949ebece68a4403c1128f": {
		"medios": 0,
		"debate": 0,
		"inis": 0,
		"pas": 0,
		"asistencia": 19,
		"bs": {
			"bs1": 0.2714285714285714,
			"bs2": 0,
			"bs3": 0,
			"bs": 1,
			"asistencia": 0.2714285714285714,
			"inis": 0,
			"pas": 0,
			"debate": 0,
			"r": 80,
			"r_pa": 48,
			"r_debate": 41,
			"r_ini": 48,
			"r_asistencia": 57
		}
	},
	"570949ebece68a4403c11290": {
		"medios": 0,
		"debate": 0,
		"inis": 0,
		"pas": 0,
		"asistencia": 11,
		"bs": {
			"bs1": 0.15714285714285714,
			"bs2": 0,
			"bs3": 0,
			"bs": 1,
			"asistencia": 0.15714285714285714,
			"inis": 0,
			"pas": 0,
			"debate": 0,
			"r": 80,
			"r_pa": 48,
			"r_debate": 41,
			"r_ini": 48,
			"r_asistencia": 63
		}
	},
	"570949ebece68a4403c11291": {
		"medios": 0,
		"debate": 2,
		"inis": 0,
		"pas": 0,
		"asistencia": 13,
		"bs": {
			"bs1": 0.4714285714285714,
			"bs2": 0,
			"bs3": 0,
			"bs": 1,
			"asistencia": 0.18571428571428572,
			"inis": 0,
			"pas": 0,
			"debate": 0.2857142857142857,
			"r": 80,
			"r_pa": 48,
			"r_debate": 39,
			"r_ini": 48,
			"r_asistencia": 61
		}
	},
	"570949ebece68a4403c11292": {
		"medios": 0,
		"debate": 7,
		"inis": 3,
		"pas": 3,
		"asistencia": 168,
		"bs": {
			"bs1": 15.4,
			"bs2": 0,
			"bs3": 0,
			"bs": 16,
			"asistencia": 2.4,
			"inis": 9,
			"pas": 3,
			"debate": 1,
			"r": 72,
			"r_pa": 45,
			"r_debate": 34,
			"r_ini": 45,
			"r_asistencia": 46
		}
	},
	"570949edece68a4403c11293": {
		"medios": 0,
		"debate": 8,
		"inis": 0,
		"pas": 0,
		"asistencia": 236,
		"bs": {
			"bs1": 4.514285714285714,
			"bs2": 0,
			"bs3": 0,
			"bs": 5,
			"asistencia": 3.3714285714285714,
			"inis": 0,
			"pas": 0,
			"debate": 1.1428571428571428,
			"r": 77,
			"r_pa": 48,
			"r_debate": 33,
			"r_ini": 48,
			"r_asistencia": 14
		}
	},
	"570949edece68a4403c11295": {
		"medios": 0,
		"debate": 15,
		"inis": 11,
		"pas": 11,
		"asistencia": 218,
		"bs": {
			"bs1": 49.25714285714286,
			"bs2": 0,
			"bs3": 0,
			"bs": 50,
			"asistencia": 3.1142857142857143,
			"inis": 33,
			"pas": 11,
			"debate": 2.142857142857143,
			"r": 52,
			"r_pa": 37,
			"r_debate": 26,
			"r_ini": 37,
			"r_asistencia": 31
		}
	},
	"570949edece68a4403c11294": {
		"medios": 1,
		"debate": 6,
		"inis": 11,
		"pas": 11,
		"asistencia": 231,
		"bs": {
			"bs1": 48.15714285714285,
			"bs2": 0,
			"bs3": 0,
			"bs": 49,
			"asistencia": 3.3,
			"inis": 33,
			"pas": 11,
			"debate": 0.8571428571428571,
			"r": 53,
			"r_pa": 37,
			"r_debate": 35,
			"r_ini": 37,
			"r_asistencia": 19
		}
	},
	"570949edece68a4403c11296": {
		"medios": 1,
		"debate": 15,
		"inis": 0,
		"pas": 0,
		"asistencia": 237,
		"bs": {
			"bs1": 5.5285714285714285,
			"bs2": 0,
			"bs3": 0,
			"bs": 6,
			"asistencia": 3.3857142857142857,
			"inis": 0,
			"pas": 0,
			"debate": 2.142857142857143,
			"r": 76,
			"r_pa": 48,
			"r_debate": 26,
			"r_ini": 48,
			"r_asistencia": 13
		}
	},
	"570949edece68a4403c1129a": {
		"medios": 0,
		"debate": 9,
		"inis": 56,
		"pas": 56,
		"asistencia": 237,
		"bs": {
			"bs1": 228.67142857142855,
			"bs2": 0,
			"bs3": 0,
			"bs": 229,
			"asistencia": 3.3857142857142857,
			"inis": 168,
			"pas": 56,
			"debate": 1.2857142857142858,
			"r": 16,
			"r_pa": 12,
			"r_debate": 32,
			"r_ini": 12,
			"r_asistencia": 13
		}
	},
	"570949eeece68a4403c1129e": {
		"medios": 0,
		"debate": 0,
		"inis": 0,
		"pas": 0,
		"asistencia": 212,
		"bs": {
			"bs1": 3.0285714285714285,
			"bs2": 0,
			"bs3": 0,
			"bs": 4,
			"asistencia": 3.0285714285714285,
			"inis": 0,
			"pas": 0,
			"debate": 0,
			"r": 78,
			"r_pa": 48,
			"r_debate": 41,
			"r_ini": 48,
			"r_asistencia": 35
		}
	},
	"570949edece68a4403c11297": {
		"medios": 1,
		"debate": 21,
		"inis": 0,
		"pas": 0,
		"asistencia": 243,
		"bs": {
			"bs1": 6.4714285714285715,
			"bs2": 0,
			"bs3": 0,
			"bs": 7,
			"asistencia": 3.4714285714285715,
			"inis": 0,
			"pas": 0,
			"debate": 3,
			"r": 75,
			"r_pa": 48,
			"r_debate": 20,
			"r_ini": 48,
			"r_asistencia": 7
		}
	},
	"570949eeece68a4403c112a2": {
		"medios": 0,
		"debate": 0,
		"inis": 20,
		"pas": 20,
		"asistencia": 251,
		"bs": {
			"bs1": 83.58571428571429,
			"bs2": 0,
			"bs3": 0,
			"bs": 84,
			"asistencia": 3.585714285714286,
			"inis": 60,
			"pas": 20,
			"debate": 0,
			"r": 37,
			"r_pa": 29,
			"r_debate": 41,
			"r_ini": 29,
			"r_asistencia": 1
		}
	},
	"570949edece68a4403c11298": {
		"medios": 0,
		"debate": 15,
		"inis": 3,
		"pas": 3,
		"asistencia": 242,
		"bs": {
			"bs1": 17.6,
			"bs2": 0,
			"bs3": 0,
			"bs": 18,
			"asistencia": 3.4571428571428573,
			"inis": 9,
			"pas": 3,
			"debate": 2.142857142857143,
			"r": 70,
			"r_pa": 45,
			"r_debate": 26,
			"r_ini": 45,
			"r_asistencia": 8
		}
	},
	"570949eeece68a4403c112a7": {
		"medios": 0,
		"debate": 11,
		"inis": 7,
		"pas": 7,
		"asistencia": 227,
		"bs": {
			"bs1": 32.81428571428572,
			"bs2": 0,
			"bs3": 0,
			"bs": 33,
			"asistencia": 3.242857142857143,
			"inis": 21,
			"pas": 7,
			"debate": 1.5714285714285714,
			"r": 60,
			"r_pa": 41,
			"r_debate": 30,
			"r_ini": 41,
			"r_asistencia": 23
		}
	},
	"570949edece68a4403c11299": {
		"medios": 0,
		"debate": 29,
		"inis": 16,
		"pas": 16,
		"asistencia": 227,
		"bs": {
			"bs1": 71.38571428571429,
			"bs2": 0,
			"bs3": 0,
			"bs": 72,
			"asistencia": 3.242857142857143,
			"inis": 48,
			"pas": 16,
			"debate": 4.142857142857143,
			"r": 41,
			"r_pa": 32,
			"r_debate": 13,
			"r_ini": 32,
			"r_asistencia": 23
		}
	},
	"570949eeece68a4403c1129b": {
		"medios": 1,
		"debate": 13,
		"inis": 6,
		"pas": 6,
		"asistencia": 242,
		"bs": {
			"bs1": 29.314285714285713,
			"bs2": 0,
			"bs3": 0,
			"bs": 30,
			"asistencia": 3.4571428571428573,
			"inis": 18,
			"pas": 6,
			"debate": 1.8571428571428572,
			"r": 63,
			"r_pa": 42,
			"r_debate": 28,
			"r_ini": 42,
			"r_asistencia": 8
		}
	},
	"570949eeece68a4403c1129c": {
		"medios": 0,
		"debate": 0,
		"inis": 0,
		"pas": 0,
		"asistencia": 225,
		"bs": {
			"bs1": 3.2142857142857144,
			"bs2": 0,
			"bs3": 0,
			"bs": 4,
			"asistencia": 3.2142857142857144,
			"inis": 0,
			"pas": 0,
			"debate": 0,
			"r": 78,
			"r_pa": 48,
			"r_debate": 41,
			"r_ini": 48,
			"r_asistencia": 25
		}
	},
	"570949eeece68a4403c112a3": {
		"medios": 0,
		"debate": 12,
		"inis": 15,
		"pas": 15,
		"asistencia": 246,
		"bs": {
			"bs1": 65.22857142857143,
			"bs2": 0,
			"bs3": 0,
			"bs": 66,
			"asistencia": 3.5142857142857142,
			"inis": 45,
			"pas": 15,
			"debate": 1.7142857142857142,
			"r": 45,
			"r_pa": 33,
			"r_debate": 29,
			"r_ini": 33,
			"r_asistencia": 5
		}
	},
	"570949eeece68a4403c112a0": {
		"medios": 1,
		"debate": 4,
		"inis": 0,
		"pas": 0,
		"asistencia": 251,
		"bs": {
			"bs1": 4.1571428571428575,
			"bs2": 0,
			"bs3": 0,
			"bs": 5,
			"asistencia": 3.585714285714286,
			"inis": 0,
			"pas": 0,
			"debate": 0.5714285714285714,
			"r": 77,
			"r_pa": 48,
			"r_debate": 37,
			"r_ini": 48,
			"r_asistencia": 1
		}
	},
	"570949eeece68a4403c1129d": {
		"medios": 1,
		"debate": 10,
		"inis": 9,
		"pas": 9,
		"asistencia": 226,
		"bs": {
			"bs1": 40.65714285714286,
			"bs2": 0,
			"bs3": 0,
			"bs": 41,
			"asistencia": 3.2285714285714286,
			"inis": 27,
			"pas": 9,
			"debate": 1.4285714285714286,
			"r": 57,
			"r_pa": 39,
			"r_debate": 31,
			"r_ini": 39,
			"r_asistencia": 24
		}
	},
	"570949eeece68a4403c112a1": {
		"medios": 0,
		"debate": 0,
		"inis": 3,
		"pas": 3,
		"asistencia": 236,
		"bs": {
			"bs1": 15.371428571428572,
			"bs2": 0,
			"bs3": 0,
			"bs": 16,
			"asistencia": 3.3714285714285714,
			"inis": 9,
			"pas": 3,
			"debate": 0,
			"r": 72,
			"r_pa": 45,
			"r_debate": 41,
			"r_ini": 45,
			"r_asistencia": 14
		}
	},
	"570949eeece68a4403c1129f": {
		"medios": 0,
		"debate": 5,
		"inis": 0,
		"pas": 0,
		"asistencia": 188,
		"bs": {
			"bs1": 3.4,
			"bs2": 0,
			"bs3": 0,
			"bs": 4,
			"asistencia": 2.6857142857142855,
			"inis": 0,
			"pas": 0,
			"debate": 0.7142857142857143,
			"r": 78,
			"r_pa": 48,
			"r_debate": 36,
			"r_ini": 48,
			"r_asistencia": 43
		}
	},
	"570949eeece68a4403c112a4": {
		"medios": 0,
		"debate": 0,
		"inis": 31,
		"pas": 31,
		"asistencia": 238,
		"bs": {
			"bs1": 127.4,
			"bs2": 0,
			"bs3": 0,
			"bs": 128,
			"asistencia": 3.4,
			"inis": 93,
			"pas": 31,
			"debate": 0,
			"r": 26,
			"r_pa": 21,
			"r_debate": 41,
			"r_ini": 21,
			"r_asistencia": 12
		}
	},
	"570949eeece68a4403c112a9": {
		"medios": 0,
		"debate": 12,
		"inis": 4,
		"pas": 4,
		"asistencia": 230,
		"bs": {
			"bs1": 21,
			"bs2": 0,
			"bs3": 0,
			"bs": 21,
			"asistencia": 3.2857142857142856,
			"inis": 12,
			"pas": 4,
			"debate": 1.7142857142857142,
			"r": 69,
			"r_pa": 44,
			"r_debate": 29,
			"r_ini": 44,
			"r_asistencia": 20
		}
	},
	"570949eeece68a4403c112a5": {
		"medios": 0,
		"debate": 15,
		"inis": 21,
		"pas": 21,
		"asistencia": 248,
		"bs": {
			"bs1": 89.68571428571428,
			"bs2": 0,
			"bs3": 0,
			"bs": 90,
			"asistencia": 3.5428571428571427,
			"inis": 63,
			"pas": 21,
			"debate": 2.142857142857143,
			"r": 36,
			"r_pa": 28,
			"r_debate": 26,
			"r_ini": 28,
			"r_asistencia": 4
		}
	},
	"570949eeece68a4403c112a8": {
		"medios": 0,
		"debate": 10,
		"inis": 3,
		"pas": 3,
		"asistencia": 201,
		"bs": {
			"bs1": 16.3,
			"bs2": 0,
			"bs3": 0,
			"bs": 17,
			"asistencia": 2.8714285714285714,
			"inis": 9,
			"pas": 3,
			"debate": 1.4285714285714286,
			"r": 71,
			"r_pa": 45,
			"r_debate": 31,
			"r_ini": 45,
			"r_asistencia": 42
		}
	},
	"570949eeece68a4403c112aa": {
		"medios": 1,
		"debate": 25,
		"inis": 90,
		"pas": 90,
		"asistencia": 251,
		"bs": {
			"bs1": 367.15714285714284,
			"bs2": 0,
			"bs3": 0,
			"bs": 368,
			"asistencia": 3.585714285714286,
			"inis": 270,
			"pas": 90,
			"debate": 3.5714285714285716,
			"r": 5,
			"r_pa": 4,
			"r_debate": 17,
			"r_ini": 4,
			"r_asistencia": 1
		}
	},
	"570949eeece68a4403c112a6": {
		"medios": 0,
		"debate": 24,
		"inis": 161,
		"pas": 161,
		"asistencia": 244,
		"bs": {
			"bs1": 650.9142857142857,
			"bs2": 0,
			"bs3": 0,
			"bs": 651,
			"asistencia": 3.4857142857142858,
			"inis": 483,
			"pas": 161,
			"debate": 3.4285714285714284,
			"r": 1,
			"r_pa": 1,
			"r_debate": 18,
			"r_ini": 1,
			"r_asistencia": 6
		}
	},
	"57094b1c032c005203421030": {
		"medios": 0,
		"debate": 2,
		"inis": 9,
		"pas": 9,
		"asistencia": 20,
		"bs": {
			"bs1": 36.57142857142857,
			"bs2": 0,
			"bs3": 0,
			"bs": 37,
			"asistencia": 0.2857142857142857,
			"inis": 27,
			"pas": 9,
			"debate": 0.2857142857142857,
			"r": 59,
			"r_pa": 39,
			"r_debate": 39,
			"r_ini": 39,
			"r_asistencia": 56
		}
	},
	"57094b1d032c005203421031": {
		"medios": 0,
		"debate": 0,
		"inis": 0,
		"pas": 0,
		"asistencia": 155,
		"bs": {
			"bs1": 2.2142857142857144,
			"bs2": 0,
			"bs3": 0,
			"bs": 3,
			"asistencia": 2.2142857142857144,
			"inis": 0,
			"pas": 0,
			"debate": 0,
			"r": 79,
			"r_pa": 48,
			"r_debate": 41,
			"r_ini": 48,
			"r_asistencia": 47
		}
	},
	"57094b1e032c005203421032": {
		"medios": 0,
		"debate": 5,
		"inis": 47,
		"pas": 47,
		"asistencia": 207,
		"bs": {
			"bs1": 191.67142857142858,
			"bs2": 0,
			"bs3": 0,
			"bs": 192,
			"asistencia": 2.9571428571428573,
			"inis": 141,
			"pas": 47,
			"debate": 0.7142857142857143,
			"r": 18,
			"r_pa": 14,
			"r_debate": 36,
			"r_ini": 14,
			"r_asistencia": 38
		}
	},
	"57094b1e032c005203421035": {
		"medios": 1,
		"debate": 18,
		"inis": 74,
		"pas": 74,
		"asistencia": 252,
		"bs": {
			"bs1": 302.1714285714286,
			"bs2": 0,
			"bs3": 0,
			"bs": 303,
			"asistencia": 3.6,
			"inis": 222,
			"pas": 74,
			"debate": 2.5714285714285716,
			"r": 7,
			"r_pa": 6,
			"r_debate": 23,
			"r_ini": 6,
			"r_asistencia": 0
		}
	},
	"57094b1e032c005203421033": {
		"medios": 0,
		"debate": 0,
		"inis": 24,
		"pas": 24,
		"asistencia": 213,
		"bs": {
			"bs1": 99.04285714285714,
			"bs2": 0,
			"bs3": 0,
			"bs": 100,
			"asistencia": 3.0428571428571427,
			"inis": 72,
			"pas": 24,
			"debate": 0,
			"r": 31,
			"r_pa": 25,
			"r_debate": 41,
			"r_ini": 25,
			"r_asistencia": 34
		}
	},
	"57094b20032c005203421037": {
		"medios": 0,
		"debate": 0,
		"inis": 20,
		"pas": 20,
		"asistencia": 234,
		"bs": {
			"bs1": 83.34285714285714,
			"bs2": 0,
			"bs3": 0,
			"bs": 84,
			"asistencia": 3.342857142857143,
			"inis": 60,
			"pas": 20,
			"debate": 0,
			"r": 37,
			"r_pa": 29,
			"r_debate": 41,
			"r_ini": 29,
			"r_asistencia": 16
		}
	},
	"57094b23032c005203421040": {
		"medios": 0,
		"debate": 2,
		"inis": 0,
		"pas": 0,
		"asistencia": 10,
		"bs": {
			"bs1": 0.42857142857142855,
			"bs2": 0,
			"bs3": 0,
			"bs": 1,
			"asistencia": 0.14285714285714285,
			"inis": 0,
			"pas": 0,
			"debate": 0.2857142857142857,
			"r": 80,
			"r_pa": 48,
			"r_debate": 39,
			"r_ini": 48,
			"r_asistencia": 64
		}
	},
	"57094b1e032c005203421034": {
		"medios": 0,
		"debate": 11,
		"inis": 11,
		"pas": 11,
		"asistencia": 216,
		"bs": {
			"bs1": 48.65714285714286,
			"bs2": 0,
			"bs3": 0,
			"bs": 49,
			"asistencia": 3.085714285714286,
			"inis": 33,
			"pas": 11,
			"debate": 1.5714285714285714,
			"r": 53,
			"r_pa": 37,
			"r_debate": 30,
			"r_ini": 37,
			"r_asistencia": 32
		}
	},
	"57094b20032c005203421036": {
		"medios": 0,
		"debate": 7,
		"inis": 9,
		"pas": 9,
		"asistencia": 221,
		"bs": {
			"bs1": 40.15714285714286,
			"bs2": 0,
			"bs3": 0,
			"bs": 41,
			"asistencia": 3.157142857142857,
			"inis": 27,
			"pas": 9,
			"debate": 1,
			"r": 57,
			"r_pa": 39,
			"r_debate": 34,
			"r_ini": 39,
			"r_asistencia": 28
		}
	},
	"57094b22032c005203421038": {
		"medios": 0,
		"debate": 27,
		"inis": 12,
		"pas": 12,
		"asistencia": 239,
		"bs": {
			"bs1": 55.271428571428565,
			"bs2": 0,
			"bs3": 0,
			"bs": 56,
			"asistencia": 3.414285714285714,
			"inis": 36,
			"pas": 12,
			"debate": 3.857142857142857,
			"r": 50,
			"r_pa": 36,
			"r_debate": 15,
			"r_ini": 36,
			"r_asistencia": 11
		}
	},
	"57094b22032c005203421039": {
		"medios": 0,
		"debate": 118,
		"inis": 87,
		"pas": 87,
		"asistencia": 233,
		"bs": {
			"bs1": 368.18571428571425,
			"bs2": 0,
			"bs3": 0,
			"bs": 369,
			"asistencia": 3.3285714285714287,
			"inis": 261,
			"pas": 87,
			"debate": 16.857142857142858,
			"r": 4,
			"r_pa": 5,
			"r_debate": 0,
			"r_ini": 5,
			"r_asistencia": 17
		}
	},
	"57094b23032c00520342103a": {
		"medios": 0,
		"debate": 12,
		"inis": 6,
		"pas": 6,
		"asistencia": 71,
		"bs": {
			"bs1": 26.728571428571428,
			"bs2": 0,
			"bs3": 0,
			"bs": 27,
			"asistencia": 1.0142857142857142,
			"inis": 18,
			"pas": 6,
			"debate": 1.7142857142857142,
			"r": 66,
			"r_pa": 42,
			"r_debate": 29,
			"r_ini": 42,
			"r_asistencia": 51
		}
	},
	"57094b23032c00520342103b": {
		"medios": 0,
		"debate": 51,
		"inis": 0,
		"pas": 0,
		"asistencia": 223,
		"bs": {
			"bs1": 10.471428571428572,
			"bs2": 0,
			"bs3": 0,
			"bs": 11,
			"asistencia": 3.1857142857142855,
			"inis": 0,
			"pas": 0,
			"debate": 7.285714285714286,
			"r": 74,
			"r_pa": 48,
			"r_debate": 5,
			"r_ini": 48,
			"r_asistencia": 27
		}
	},
	"57094b23032c00520342103c": {
		"medios": 1,
		"debate": 109,
		"inis": 12,
		"pas": 12,
		"asistencia": 249,
		"bs": {
			"bs1": 67.12857142857143,
			"bs2": 0,
			"bs3": 0,
			"bs": 68,
			"asistencia": 3.557142857142857,
			"inis": 36,
			"pas": 12,
			"debate": 15.571428571428571,
			"r": 43,
			"r_pa": 36,
			"r_debate": 1,
			"r_ini": 36,
			"r_asistencia": 3
		}
	},
	"57094b23032c00520342103f": {
		"medios": 1,
		"debate": 46,
		"inis": 0,
		"pas": 0,
		"asistencia": 244,
		"bs": {
			"bs1": 10.057142857142857,
			"bs2": 0,
			"bs3": 0,
			"bs": 11,
			"asistencia": 3.4857142857142858,
			"inis": 0,
			"pas": 0,
			"debate": 6.571428571428571,
			"r": 74,
			"r_pa": 48,
			"r_debate": 8,
			"r_ini": 48,
			"r_asistencia": 6
		}
	},
	"57094b23032c00520342103e": {
		"medios": 1,
		"debate": 55,
		"inis": 13,
		"pas": 13,
		"asistencia": 243,
		"bs": {
			"bs1": 63.32857142857143,
			"bs2": 0,
			"bs3": 0,
			"bs": 64,
			"asistencia": 3.4714285714285715,
			"inis": 39,
			"pas": 13,
			"debate": 7.857142857142857,
			"r": 47,
			"r_pa": 35,
			"r_debate": 4,
			"r_ini": 35,
			"r_asistencia": 7
		}
	},
	"57094b23032c00520342103d": {
		"medios": 0,
		"debate": 28,
		"inis": 72,
		"pas": 72,
		"asistencia": 243,
		"bs": {
			"bs1": 295.4714285714286,
			"bs2": 0,
			"bs3": 0,
			"bs": 296,
			"asistencia": 3.4714285714285715,
			"inis": 216,
			"pas": 72,
			"debate": 4,
			"r": 8,
			"r_pa": 7,
			"r_debate": 14,
			"r_ini": 7,
			"r_asistencia": 7
		}
	},
	"57094b25032c005203421041": {
		"medios": 0,
		"debate": 5,
		"inis": 0,
		"pas": 0,
		"asistencia": 19,
		"bs": {
			"bs1": 0.9857142857142858,
			"bs2": 0,
			"bs3": 0,
			"bs": 1,
			"asistencia": 0.2714285714285714,
			"inis": 0,
			"pas": 0,
			"debate": 0.7142857142857143,
			"r": 80,
			"r_pa": 48,
			"r_debate": 36,
			"r_ini": 48,
			"r_asistencia": 57
		}
	},
	"57094b25032c005203421042": {
		"medios": 0,
		"debate": 7,
		"inis": 6,
		"pas": 6,
		"asistencia": 51,
		"bs": {
			"bs1": 25.728571428571428,
			"bs2": 0,
			"bs3": 0,
			"bs": 26,
			"asistencia": 0.7285714285714285,
			"inis": 18,
			"pas": 6,
			"debate": 1,
			"r": 67,
			"r_pa": 42,
			"r_debate": 34,
			"r_ini": 42,
			"r_asistencia": 54
		}
	},
	"57094b25032c005203421043": {
		"medios": 0,
		"debate": 6,
		"inis": 2,
		"pas": 2,
		"asistencia": 243,
		"bs": {
			"bs1": 12.32857142857143,
			"bs2": 0,
			"bs3": 0,
			"bs": 13,
			"asistencia": 3.4714285714285715,
			"inis": 6,
			"pas": 2,
			"debate": 0.8571428571428571,
			"r": 73,
			"r_pa": 46,
			"r_debate": 35,
			"r_ini": 46,
			"r_asistencia": 7
		}
	},
	"57094b25032c005203421044": {
		"medios": 0,
		"debate": 6,
		"inis": 6,
		"pas": 6,
		"asistencia": 242,
		"bs": {
			"bs1": 28.314285714285713,
			"bs2": 0,
			"bs3": 0,
			"bs": 29,
			"asistencia": 3.4571428571428573,
			"inis": 18,
			"pas": 6,
			"debate": 0.8571428571428571,
			"r": 64,
			"r_pa": 42,
			"r_debate": 35,
			"r_ini": 42,
			"r_asistencia": 8
		}
	},
	"57094b25032c005203421045": {
		"medios": 0,
		"debate": 0,
		"inis": 47,
		"pas": 47,
		"asistencia": 239,
		"bs": {
			"bs1": 191.4142857142857,
			"bs2": 0,
			"bs3": 0,
			"bs": 192,
			"asistencia": 3.414285714285714,
			"inis": 141,
			"pas": 47,
			"debate": 0,
			"r": 18,
			"r_pa": 14,
			"r_debate": 41,
			"r_ini": 14,
			"r_asistencia": 11
		}
	},
	"57094b25032c005203421046": {
		"medios": 0,
		"debate": 14,
		"inis": 7,
		"pas": 7,
		"asistencia": 79,
		"bs": {
			"bs1": 31.12857142857143,
			"bs2": 0,
			"bs3": 0,
			"bs": 32,
			"asistencia": 1.1285714285714286,
			"inis": 21,
			"pas": 7,
			"debate": 2,
			"r": 61,
			"r_pa": 41,
			"r_debate": 27,
			"r_ini": 41,
			"r_asistencia": 49
		}
	},
	"57094b25032c005203421047": {
		"medios": 0,
		"debate": 14,
		"inis": 4,
		"pas": 4,
		"asistencia": 250,
		"bs": {
			"bs1": 21.571428571428573,
			"bs2": 0,
			"bs3": 0,
			"bs": 22,
			"asistencia": 3.5714285714285716,
			"inis": 12,
			"pas": 4,
			"debate": 2,
			"r": 68,
			"r_pa": 44,
			"r_debate": 27,
			"r_ini": 44,
			"r_asistencia": 2
		}
	},
	"57094b25032c00520342104a": {
		"medios": 1,
		"debate": 0,
		"inis": 25,
		"pas": 25,
		"asistencia": 213,
		"bs": {
			"bs1": 103.04285714285714,
			"bs2": 0,
			"bs3": 0,
			"bs": 104,
			"asistencia": 3.0428571428571427,
			"inis": 75,
			"pas": 25,
			"debate": 0,
			"r": 30,
			"r_pa": 24,
			"r_debate": 41,
			"r_ini": 24,
			"r_asistencia": 34
		}
	},
	"57094b25032c00520342104b": {
		"medios": 0,
		"debate": 7,
		"inis": 7,
		"pas": 7,
		"asistencia": 236,
		"bs": {
			"bs1": 32.37142857142857,
			"bs2": 0,
			"bs3": 0,
			"bs": 33,
			"asistencia": 3.3714285714285714,
			"inis": 21,
			"pas": 7,
			"debate": 1,
			"r": 60,
			"r_pa": 41,
			"r_debate": 34,
			"r_ini": 41,
			"r_asistencia": 14
		}
	},
	"57094b25032c00520342104c": {
		"medios": 0,
		"debate": 1,
		"inis": 10,
		"pas": 10,
		"asistencia": 76,
		"bs": {
			"bs1": 41.228571428571435,
			"bs2": 0,
			"bs3": 0,
			"bs": 42,
			"asistencia": 1.0857142857142856,
			"inis": 30,
			"pas": 10,
			"debate": 0.14285714285714285,
			"r": 56,
			"r_pa": 38,
			"r_debate": 40,
			"r_ini": 38,
			"r_asistencia": 50
		}
	},
	"57094b25032c005203421048": {
		"medios": 0,
		"debate": 9,
		"inis": 10,
		"pas": 10,
		"asistencia": 79,
		"bs": {
			"bs1": 42.41428571428571,
			"bs2": 0,
			"bs3": 0,
			"bs": 43,
			"asistencia": 1.1285714285714286,
			"inis": 30,
			"pas": 10,
			"debate": 1.2857142857142858,
			"r": 55,
			"r_pa": 38,
			"r_debate": 32,
			"r_ini": 38,
			"r_asistencia": 49
		}
	},
	"57094b25032c00520342104d": {
		"medios": 1,
		"debate": 1,
		"inis": 0,
		"pas": 0,
		"asistencia": 20,
		"bs": {
			"bs1": 0.42857142857142855,
			"bs2": 0,
			"bs3": 0,
			"bs": 1,
			"asistencia": 0.2857142857142857,
			"inis": 0,
			"pas": 0,
			"debate": 0.14285714285714285,
			"r": 80,
			"r_pa": 48,
			"r_debate": 40,
			"r_ini": 48,
			"r_asistencia": 56
		}
	},
	"57094b25032c005203421049": {
		"medios": 1,
		"debate": 9,
		"inis": 28,
		"pas": 28,
		"asistencia": 223,
		"bs": {
			"bs1": 116.47142857142858,
			"bs2": 0,
			"bs3": 0,
			"bs": 117,
			"asistencia": 3.1857142857142855,
			"inis": 84,
			"pas": 28,
			"debate": 1.2857142857142858,
			"r": 29,
			"r_pa": 23,
			"r_debate": 32,
			"r_ini": 23,
			"r_asistencia": 27
		}
	},
	"570946e967ee364103b9a5cb": {
		"medios": 1,
		"debate": 30,
		"inis": 23,
		"pas": 23,
		"asistencia": 52,
		"bs": {
			"bs1": 97.02857142857144,
			"bs2": 0,
			"bs3": 0,
			"bs": 98,
			"asistencia": 0.7428571428571429,
			"inis": 69,
			"pas": 23,
			"debate": 4.285714285714286,
			"r": 32,
			"r_pa": 26,
			"r_debate": 12,
			"r_ini": 26,
			"r_asistencia": 53
		}
	}
}
var dipuvar=[];
var updatelist={};
orderednews={};
module.exports = module.export =
{
	news: function ( req, res, app, cb ){
		for (var i = 0; i < news_array.length; i++) {
			orderednews[news_array[i][3].trim() ]=news_array[i]
		}
		console.log("noticias")
		console.log("--")
		var c = new Crawler({
		    maxConnections : 100,
		    forceUTF8:true,		    
		    callback : function (error, result, $) {
		    	console.log("returned");
		    	allt=$('body').text();
				//console.log(allt);				//addinis(inis,app);
				for (var i = 0; i < dipuvar.length; i++) {
					//console.log(dipuvar[i].name);
					dipnames=dipuvar[i].name.trim().split(" ");
					reses=[];
					for (var j = 1; j < dipnames.length; j++) {
						
						search=dipnames[0]+" "+dipnames[j];
						//console.log(search);
						if (allt.indexOf(search) !== -1) {
							console.log("MATCH",dipuvar[i].name);
							if ( !updatelist[ dipuvar[i].id ] ) {
								updatelist[ dipuvar[i].id ] =[];
								updatelist[ dipuvar[i].id ].push({ url:result.uri , 
									title : orderednews[result.uri][0] ,
									date : orderednews[result.uri][2] , 
									medio : orderednews[result.uri][1]
								});

							}
							else{
								updatelist[ dipuvar[i].id ].push();
							}
							
						}
						
					}
					//updatelist[ dipuvar[i].id ] = reses
				}
				for (var key in updatelist) {
				  if (updatelist.hasOwnProperty(key)) {
				    app.models[ "diputados" ].update(  key , { newslist : updatelist[key] }, function (err,doc ){ 
			            console.log("err:"+err);
			            console.log("updated",doc[0].name,doc[0].newslist);
			            //res.end( JSON.stringify( doc ) );
			         });
				  }
				}
				

				console.log(updatelist);
		    }
		});
		app.models[ "diputados" ].find({ camara:"senadores" , ordenDeGobierno: "Federal" }).exec(function (err, dips){
			  if (err) {
			    console.log(err);
			  }
			  else{
			  	dipuvar=dips;
			  	console.log('Number dips:',"senadores","Federal", dips.length);		
			  	for (var i = 0; i < news_array.length; i++) {
			  			  		console.log(news_array[i][3].trim() );
			  			  		c.queue( news_array[i][3].trim() );
			  	}		  	
			  	//c.queue('http://www.sopitas.com/598955-murillo-karam-ayotzinapa-diputados-giei/');
			  }
		});

		
	},
	bss: function ( req, res, app, cb ){
		for(iddip in bscore){
			bscore[iddip].id=iddip;
			//console.log(bscore[iddip].bs)
		}
		async.eachSeries(bscore, function iteratee(item, callback) {
		    	app.models[ "diputados" ].update(item.id , {bs:item.bs}).exec(function createCB(err, created){
		    		 console.log("udated",created[0].name,created[0].bs);
		    		callback(null, created[0]);
		           
		        });
		         // if many items are cached, you'll overflow
		   
		}, function done() {
		    //...
		});
		
	}
}

