const name = getQueryVariable('name') || 'Anonymous';
const room = getQueryVariable('room');
const socket = io();

console.log(name + ' wants to join ' + room);

// Update h1 tag
jQuery('.room-title').text(room);

socket.on('connect', function () {
	console.log('Connected to socket.io server!');
	socket.emit('joinRoom', {
		name: name,
		room: room
	});
});

socket.on('message', function (message) {
	const momentTimestamp = moment.utc(message.timestamp);
	const $messages = jQuery('.messages');
	const $message = jQuery('<li class="list-group-item"></li>');

	console.log('New message:');
	console.log(message.text);

	$message.append('<p><strong>' + message.name + ' ' + momentTimestamp.local().format('h:mm a') + '</strong></p>');
	$message.append('<p>' + message.text + '</p>');
	$messages.append($message);
});

// Handles submitting of new message
const $form = jQuery('#message-form');

$form.on('submit', function (event) {
	event.preventDefault();

	const $message = $form.find('input[name=message]');

	socket.emit('message', {
		name,
		text: $message.val()
	});

	$message.val('');
});
