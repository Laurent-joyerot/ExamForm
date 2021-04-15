const mongoose = require('mongoose');
const nodeFormSchema = new mongoose.Schema({
	name: {
    	type: String,
    	trim: true,
	},
	email: {
    	type: String,
    	trim: true,
	},
	message: {
    	type: String,
    	trim: true,
	},
});

module.exports = mongoose.model('Node-form', nodeFormSchema);
