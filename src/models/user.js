const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
			trim: true,
			maxlength: 50,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
			maxlength: 50,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
			index: true,
			lowercase: true,
		},
		contact: {
			type: String,
			required: true,
			trim: true,
			unique: true,
			minlength: 10,
		},
		password: {
			type: String,
			required: true,
			minlength: 8,
			select: false,
		},
		role: {
			type: String,
			required: true,
			enum: ['student', 'admin', 'faculty', 'staff', 'superAdmin'],
		},
		department: {
			type: String,
			trim: true,
			maxlength: 50,
		},
		office: {
			type: String,
			trim: true,
			maxlength: 50,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('user', UserSchema);