const http = require('http');
const mongoose = require('mongoose');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const PORT = 8080;

const { addUser, removeUser, getConversations, getUsersInRoom, createConversation } = require('./user');
const conversation = require('./models/conversation');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// const userRoute = require('./routes/users');

app.use(cors());
// app.use(userRoute);

io.on('connect', (socket) => {
	console.log('welcome to my chat app server');
	let msgRoom;
	socket.on('join', async ({ room, name }, callback) => {
		console.log(name, room);
		let conversations;
		if (!(await getConversations(room))) {
			conversations = await createConversation({ id: socket.id, room, name });
			console.log(conversations);
		} else {
			conversations = await getConversations(room);
		}

		msgRoom = conversations.conversationId;
		// if (error) return callback(error);
		console.log(conversations.conversationId);
		socket.join(conversations.conversationId);

		// socket.emit('message', { user: 'admin', text: `${name} start chatting.` });
		// socket.broadcast.to(room).emit('message', { user: 'admin', text: `${name} just joined!` });

		io.to(conversations.conversationId).emit('onJoin', { onJoin: true });

		callback();
	});

	socket.on('sendMessage', (message, callback) => {
		// const user = getUser(socket.id);
		console.log(message);
		io.to(msgRoom).emit('message', { text: message });

		callback();
	});

	socket.on('disconnect', () => {
		console.log('user has left');
	});
});

server.listen(PORT, () => {
	mongoose
		.connect('mongodb://localhost/chatapp', {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true,
			autoIndex: false,
		})
		.then(() => console.log('Server and DB Connected'));
	console.log(`listening on *:${PORT}`);
});
