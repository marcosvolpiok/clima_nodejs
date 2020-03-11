var express = require('express');
var http = require('http');
var app = express();
const https = require('https');

function findWeather(req, res) {
  https
    .get(
      // `https://samples.openweathermap.org/data/2.5/weather?q=${req.params.city}&appid=835b68b2ab76641ee3803cf5012962c1`,
      `https://api.openweathermap.org/data/2.5/weather?q=${req.params.city}&appid=835b68b2ab76641ee3803cf5012962c1`,
      resp => {
        let data = '';

        resp.on('data', chunk => {
          data += chunk;
        });

        resp.on('end', () => {
          console.log(JSON.parse(data).weather[0].description);
          let tiempo;
          tiempo = { description: JSON.parse(data).weather[0].description };
          res.send(tiempo);
        });
      }
    )
    .on('error', err => {
      console.log('Error: ' + err.message);
    });
}

function findForecast(req, res) {
  https
    .get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${req.params.city}&appid=835b68b2ab76641ee3803cf5012962c1`,

      resp => {
        let data = '';

        resp.on('data', chunk => {
          data += chunk;
        });

        resp.on('end', () => {
          let tiempo = [];
          for (i = 0; i < 5; i++) {
            let tiempoDescription = {};
            tiempoDescription['description'] = JSON.parse(data).list[i].weather[0].description;
            tiempo.push(tiempoDescription);
          }
          res.send(tiempo);
        });
      }
    )
    .on('error', err => {
      console.log('Error: ' + err.message);
    });
}

var v1 = express.Router();

v1.use('/current', express.Router().get('/:city?', findWeather));
v1.use('/forecast', express.Router().get('/:city?', findForecast));

app.use('/v1', v1);
app.use('/', v1);

http.createServer(app).listen(8081, function() {
  console.log('Escuchando en puerto 8081');
});
