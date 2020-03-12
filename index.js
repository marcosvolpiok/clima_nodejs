const express = require('express');
const http = require('http');
const app = express();
const https = require('https');

function getCityFromIp(req) {
  //Get IP
  console.log('ip: ' + req.connection.remoteAddress);

  let ip = '';
  //::1
  if (req.connection.remoteAddress == '::1') {
    ip = null;
  } else if (req.connection.remoteAddress == '127.0.0.1') {
    ip = null;
  } else if (req.connection.remoteAddress.search(':') != -1) {
    //ip v6
    ip = req.connection.remoteAddress.split(':')[3];
  } else {
    //ip v4
    ip = req.connection.remoteAddress;
  }

  let ciudad = '';
  if (ip == null) {
    //Si la IP es localhost
    return new Promise(resolve => {
      resolve('Buenos Aires');
    });
  } else {
    return new Promise(resolve => {
      http
        .get('http://www.ip-api.com/json/24.48.0.1', resp => {
          let data = '';

          // A chunk of data has been recieved.
          resp.on('data', chunk => {
            data += chunk;
          });

          // The whole response has been received. Print out the result.
          resp.on('end', () => {
            console.log(JSON.parse(data).city);
            resolve(JSON.parse(data).city);
          });
        })
        .on('error', err => {
          console.log('Error: ' + err.message);
        });
    });
  }
}

async function findWeather(req, res) {
  let ciudad = '';
  if (!req.params.city) {
    ciudad = await getCityFromIp(req);
  } else {
    ciudad = req.params.city;
  }

  https
    .get(
      // `https://samples.openweathermap.org/data/2.5/weather?q=${req.params.city}&appid=835b68b2ab76641ee3803cf5012962c1`,
      `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=835b68b2ab76641ee3803cf5012962c1`,
      resp => {
        let data = '';

        resp.on('data', chunk => {
          data += chunk;
        });

        resp.on('end', () => {
          console.log(JSON.parse(data).weather[0].description);
          let tiempo;
          tiempo = [{ description: JSON.parse(data).weather[0].description }];
          res.send(tiempo);
        });
      }
    )
    .on('error', err => {
      console.log('Error: ' + err.message);
    });
}

async function findForecast(req, res) {
  let ciudad = '';
  if (!req.params.city) {
    ciudad = await getCityFromIp(req);
  } else {
    ciudad = req.params.city;
  }

  https
    .get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${ciudad}&appid=835b68b2ab76641ee3803cf5012962c1`,

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

//CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-COntrol-Allow-Request-Method'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

v1.use('/current', express.Router().get('/:city?', findWeather));
v1.use('/forecast', express.Router().get('/:city?', findForecast));

app.use('/v1', v1);
app.use('/', v1);

http.createServer(app).listen(8081, function() {
  console.log('Escuchando en puerto 8081');
});
