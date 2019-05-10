const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const eventSchema = new Schema({
	title: {
		type: String,
		requied: true
	},
	description: {
		type: String,
		requied: true
	},
	price: {
		type: Number,
		requied: true
	},
	date: {
		type: Date,
		requied: true
	},
	creator: {
		type: Schema.Types.ObjectId,
		ref: "User"
	}
});

module.exports = mongoose.model("Event", eventSchema);
