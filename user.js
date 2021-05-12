const Conversation = require('./models/conversation');

const users = [];

const addUser = ({ id, name, room }) => {
	name = name.trim().toLowerCase();
	room = room.trim().toLowerCase();

	const existingUser = users.find((user) => user.room === room && user.name === name);

	if (!name || !room) return { error: 'Username and room are required.' };
	if (existingUser) return { error: 'Username is taken.' };

	const user = { id, name, room };

	users.push(user);

	return { user };
};

const createConversation = async ({ socketId, name, room }) => {
	try {
		const conversation = new Conversation({ socketId, conversationId: room, name });
		return conversation;
		return await conversation.save();
	} catch (error) {
		return error.message;
	}
};

const getConversations = async (room) => {
	try {
		return await Conversation.findOne({ conversationId: room });
	} catch (error) {
		return error.message;
	}
};

const removeUser = (id) => {
	const index = users.findIndex((user) => user.id === id);

	if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = (id) => Conversation.findOne({ id });

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { createConversation, addUser, removeUser, getConversations, getUsersInRoom };
