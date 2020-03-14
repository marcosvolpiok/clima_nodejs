var expect  = require('chai').expect;
var request = require('request');



var request = require('supertest');
describe('loading express', function () {
  var server;
  beforeEach(function () {
    server = require('../index');
  });
  afterEach(function () {
    server.close();
  });
  it('responds to /currentcurrent without city', function testSlash(done) {
    request(server)
      .get('/current')
      .expect(200, done);
    });
    it('responds to /forecast without city', function testSlash(done) {
        request(server)
        .get('/forecast')
        .expect(200, done);
    });
    it('responds to currentcurrent with city', function testSlash(done) {
        request(server)
        .get('/current/caracas')
        .expect(200, done);
    });
    it('responds to /forecast with city', function testSlash(done) {
        request(server)
        .get('/forecast/caracas')
        .expect(200, done);
    });          
  it('404 doesnt not exist', function testPath(done) {
    request(server)
      .get('/doesnt/not/exist')
      .expect(404, done);
  });
});