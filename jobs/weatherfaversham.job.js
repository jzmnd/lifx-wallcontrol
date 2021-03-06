var http = require('http');
var logger = require('../logger.js');

// WOEID for location
var woeid = 19991;

// Units for temperature (f: Fahrenheit, c: Celsius)
var format = 'f';
var query = encodeURIComponent('select * from weather.forecast WHERE woeid=' + woeid + ' and u="' + format + '"');

function fetchWeather() {
  http.get('http://query.yahooapis.com/v1/public/yql?format=json&q=' + query, function(res) {
    if (res.statusCode == 200) {
      var body = '';
      res.on('data', function(chunk) {
        body += chunk;
      });
      res.on('end', function() {
        body = JSON.parse(body);
        var results = body.query.results;
        if (results) {
          var condition = results.channel.item.condition;
          var location = results.channel.location;
          send_event('weatherfaversham', {
            location: location.city,
            temperature: condition.temp,
            code: condition.code,
            format: format
          });
        }
      });
    } else {
      logger.info('Yahoo Weather status code: ' + res.statusCode);
    }
  }).on('error', function(err) {
    logger.error('Error reading from Yahoo Weather: ', err);
  });
}

setInterval(fetchWeather, 60 * 1000);
fetchWeather();
