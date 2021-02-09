const express = require('express');
const app = express();

const PORT = process.env.PORT || 3001;

const cors = require('cors');
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: 'http://localhost:3000' } });

app.use(cors());

io.on('connect', socket => {
	let name;

	socket.on('getName', (username) => {
		name = username;
	});

	socket.on('disconnect', () => {
		const date = new Date();
		console.log(`[${date.toLocaleTimeString('pt-BR')}] ${name} se desconectou`);
		io.emit('message', { message: `${name} saiu`, bot: true });
	});

	socket.on('message', payload => {
		const date = new Date();
		console.log(`[${date.toLocaleTimeString('pt-BR')}] MESSAGE - ${name || 'bot'}: ${payload.message}`, payload);
		io.emit('message', payload);
	});

});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));