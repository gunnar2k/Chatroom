/*
* Start appen: node redis.js
*/
var pub = require('redis').createClient()
var sub = require('redis').createClient()
/*
*
* REDIS FORESPØRSLER
*
*/
sub.on("ready", function () {

  sub.subscribe("redis");

});

sub.on("message", function (channel, message) {
  
  pub.publish('server', message)

})

console.log("Redis kjører...")