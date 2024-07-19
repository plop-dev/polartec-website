import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	displayName: {
		type: String,
		required: true,
	},
	uniqueName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	dateCreated: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.models.User || mongoose.model('User', userSchema, 'Users');
