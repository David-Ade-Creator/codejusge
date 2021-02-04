const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	pendingRequests: {
		type: Array
	},
	friends: {
		type: Array
	},
	suggestions: {
		type: Array
	}
});


module.exports = mongoose.model("users", UserSchema);
