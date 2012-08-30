

/*
* Start appen: node server.js
*/


var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require("socket.io").listen(server)





io.set('log level' , 0)

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.static(__dirname + '/public'));
});

server.listen(3000, function(){
  console.log("App lytter på port 3000")
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
    
    socket.set('navn', navn)

    console.log(navn + " satte navnet sitt")
  })






  socket.on('ny melding', function(melding) {

    socket.get('navn', function(err, navn) {

      if ( navn ) {

        var meldingObj = {
          navn : navn,
          melding : melding
        }

        io.sockets.emit('ny melding', meldingObj)  

        console.log(navn + " sendte meldingen \"" + melding + "\". Pusher til socketklientene.")
      }
    })
  })
});