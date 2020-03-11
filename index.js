var express = require('express');
var http = require('http');
var app = express();
const https = require('https');

function findWeather(req, res) {
  https
    .get(
      `https://samples.openweathermap.org/data/2.5/weather?q=${req.params.city}&appid=835b68b2ab76641ee3803cf5012962c1`,
      resp => {
        let data = '';

        resp.on('data', chunk => {
          data += chunk;
        });

        resp.on('end', () => {
          console.log(JSON.parse(data).weather[0].description);
        });
      }
    )
    .on('error', err => {
      console.log('Error: ' + err.message);
    });
}

// Set up the routing.
var v1 = express.Router();
var v2 = express.Router();

v1.use('/current', express.Router().get('/:city?', findWeather));

app.use('/v1', v1);
app.use('/', v1); // Set the default version to latest.

// Setup server.
http.createServer(app).listen(8081, function() {
  console.log('Escuchando en puerto 8081');
});
