const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Pusher = require('pusher');
const crypto = require('crypto');

const createToken = (user) => {
	if (!user.role) throw new Error('No user role specified');
	if (!user._id) throw new Error('No user id specified');

	return jwt.sign(
		{
			jti: crypto.randomUUID(),
			sub: user._id,
			email: user.email,
			role: user.role,
			firstName: user.firstName,
			lastName: user.lastName,
			iss: 'api.mishelpline',
			aud: 'api.mishelpline',
		},
		process.env.JWT_SECRET_KEY,
		{ algorithm: 'HS256', expiresIn: '5h' }
	);
};

const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(12);
	return bcrypt.hash(password, salt);
};

const verifyPassword = (passwordAttempt, hashedPassword) => {
	return bcrypt.compare(passwordAttempt, hashedPassword);
};

const pusher = new Pusher({
	appId: process.env.APP_ID,
	key: process.env.APP_KEY,
	secret: process.env.APP_SECRET,
	cluster: process.env.APP_CLUSTER,
	useTLS: true,
});

module.exports = { createToken, hashPassword, verifyPassword, pusher };
