

/*
* Start appen: node server.js -p <PORT>
*/


var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require("socket.io").listen(server)
var pub = require('redis').createClient()
var sub = require('redis').createClient()
var opts = require('opts')




opts.parse([
  {
    short  : 'p',
    long   : 'port',
    description : 'Port som app lytter til',
    required : true,
    value : true
  }
], true);






io.set('log level' , 0)

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.static(__dirname + '/public'));
});

server.listen(opts.get('port'), function(){
  console.log("App lytter til port %d", opts.get('port'));
});







/*
*
* APP - GET/POST REQUESTS
*
*/



app.get('/chat', function(req, res) {

  console.log("Ny GET forespørsel")

  res.render('chatrooms');
});








/*
*
* APP - WEBSOCKET REQUESTS
*
*/




io.sockets.on('connection', function (socket) {
  
  console.log("Ny WEBSOCKET forbindelse")








  socket.on('sett navn', function(navn) {

    console.log(navn + " satte navnet sitt")

    socket.set('navn', navn)
  })







  socket.on('ny melding', function(melding) {

    socket.get('navn', function(err, navn) {

      if ( navn ) {
        
        var meldingObj = {
          navn : navn,
          melding : melding
        }

        
        /*
        io.sockets.emit('ny melding', meldingObj)  

        console.log(navn + " sendte meldingen \"" + melding + "\". Pusher til socketklientene.")
  */
        
        pub.publish("redis", JSON.stringify(meldingObj));
        
        console.log(navn + " sendte meldingen \"" + melding + "\". Pusher til redis.")
        
      }
    })
  })
});









/*
*
* APP - REDIS
*
*/



sub.on("ready", function () {

  sub.subscribe("server");

});

sub.on("message", function (channel, message) {
  
  var meldingObj = JSON.parse(message);

  io.sockets.emit('ny melding', meldingObj)  

  console.log("Mottok meldingen \"" + meldingObj.melding + "\" fra " + meldingObj.navn + " via redis. Pusher til socketklientene.")
})





