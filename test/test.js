var expect  = require("chai").expect;
var request = require("request");
var async = require("async");

/*

Funciones para testear en mocha creación de un legislador (Para correr como prueba)

*/


describe("API check",function(){
	url="http://localhost:8080/";
	it("returns 200",function(done){
		request(url, function(error, response, body) {
	        expect(response.statusCode).to.equal(200);
	        done();
	    });
	})
})
describe("API diputados",function(){
	iddip="0";
	idnews="0";
	idini="0";
	idcom="0";

	namedip="";
	headline="";
	before(function(added){
		request.post({url:"http://localhost:8080/diputados/", json: {name:"test"} }, function(error, response, body) {
			iddip=body.id;
			namedip=body.name;
			added();
		});
	});
	it("crea legislador",function(){
		console.log("Legisladores:");
		created=0;
		if (iddip!=0 && namedip=="test") {created=1;};
		expect(created).to.equal(1);
	});
	it("gets legislador",function(done){

		request.post({url:"http://localhost:8080/diputados/get", json: {where:{name:"test"}} }, function(error, response, body) {
			expect(body.length).to.equal(1);
			done();
		});
	});
	it("updates legislador",function(done){
		request.put({url:"http://localhost:8080/diputados", json: {id:iddip,name:"test updated"} }, function(error, response, body) {
			expect(body[0].name).to.equal("test updated");
			done();
		});
	});
	it("añade una noticia",function(done){
		console.log("noticias:")
		created=0;
		request.post({url:"http://localhost:8080/news/", json: {headline:"test news"} }, function(error, response, body) {
			headline=body.headline;
			idnews=body.id;
			if (idnews.length > 1) {created=1;}
			expect(created).to.equal(1);
			done();
		});
 	});
 	it("gets noticia",function(done){
		created=0;

		request.post({url:"http://localhost:8080/news/get", json: {where:{headline:headline}} }, function(error, response, body) {
			expect(body[0].headline).to.equal(headline);
			done();
		});
 	});
	it("añade una mención",function(done){
		created=0;
		request.post({url:"http://localhost:8080/diputados/news", json: {id:iddip,idn:idnews} }, function(error, response, body) {
			created=0;
			if (body == "added") {created=1;};
			expect(created).to.equal(1);
			done();
		});
 	});
 	it("borra la noticia",function(done){
		created=0;
		request.del({url:"http://localhost:8080/news", json: {id:idnews} }, function(error, response, body) {
			expect(body[0].id).to.equal(idnews);
			done();
		});
 	});
 	it("añade iniciativa",function(done){
 		console.log("Trabajo legislativo:")
		request.post({url:"http://localhost:8080/trabajo", json: {title:"ini 1",resumen:"descripción"} }, function(error, response, body) {
			idini=body.id;
			created=0;
			if (body.id.length > 1) {created=1;};
			
			expect(created).to.equal(1);
			done();
		});
 	});
 	it("añade autoría",function(done){
		created=0;
		request.post({url:"http://localhost:8080/diputados/trabajo", json: {id:iddip,idt:idini} }, function(error, response, body) {
			created=0;
			if (body == "added") {created=1;};
			expect(created).to.equal(1);
			done();
		});
 	});
 	it("borra iniciativa",function(done){
		created=0;
		request.del({url:"http://localhost:8080/trabajo", json: {id:idini} }, function(error, response, body) {
			expect(body[0].id).to.equal(idini);
			done();
		});
 	});
 	it("Añade comisión",function(done){
		created=0;
		request.post({url:"http://localhost:8080/comisiones/", json: {id:idini} }, function(error, response, body) {
			idcom=body.id;
			created=0;
			if (idcom!=0) {created=1}
			expect(created).to.equal(1);
			done();
		});
 	});
 	it("Añade Integrante",function(done){
		created=0;
		request.post({url:"http://localhost:8080/comisiones/addmember", json: {id:iddip,idc:idcom} }, function(error, response, body) {
			created=0;
			if (body == "added") {created=1;};
			expect(created).to.equal(1);
		});
 	});
 	it("Borra comisión",function(done){
		created=0;
		request.del({url:"http://localhost:8080/diputados/com", json: {idc:idcom} }, function(error, response, body) {
			expect(body[0].id).to.equal(idcom);
			done();
		});
 	});
	it("deletes dip",function(done){
		console.log("Limpieza:")
		request.del({url:"http://localhost:8080/diputados", json: {id:iddip} }, function(error, response, body) {
			expect(body[0].id).to.equal(iddip);
			done();
		});
	});
})