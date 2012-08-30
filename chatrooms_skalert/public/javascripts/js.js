var socket = io.connect();

$(document).ready(function() {

	var navn = false

	while ( !navn ) {
		navn = prompt("Hva er navnet ditt?");	
	}
	
	socket.emit('sett navn', navn)

	$('#ny_melding').focus()

	$('#ny_melding').keypress(function(e) {

		if(e.keyCode == 13) { 

			var ny_melding = $('#ny_melding').val();

			if ( ny_melding != '' ) {

				socket.emit('ny melding', ny_melding)	

				$('#ny_melding').val('');
			}
		}
	})
})

socket.on('ny melding', function (melding) {
	$('ul').prepend('<li>&lt;' + melding.navn + '&gt; ' + melding.melding + '</li>')
});