const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
	{
		socketId: {
			type: String,
			require: true,
			min: 3,
			max: 20,
			unique: true,
		},
		conversationId: {
			type: String,
			require: true,
			min: 3,
			max: 20,
			unique: true,
		},
		name: {
			type: String,
			required: true,
			max: 50,
			unique: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Conversation', conversationSchema);
