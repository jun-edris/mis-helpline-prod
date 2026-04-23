const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/tokenBlacklist');

const verifyToken = async (req) => {
	const token = req.cookies.token;
	if (!token) return null;
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY, {
			algorithms: ['HS256'],
			issuer: 'api.mishelpline',
			audience: 'api.mishelpline',
		});
		if (decoded.jti && await TokenBlacklist.exists({ jti: decoded.jti })) return null;
		return decoded;
	} catch {
		return null;
	}
};

exports.attachUser = async (req, res, next) => {
	const user = await verifyToken(req);
	if (!user)
		return res.status(401).json({ message: 'Authentication Invalid' });
	req.user = user;
	next();
};

exports.requireAdmin = async (req, res, next) => {
	const user = await verifyToken(req);
	if (!user)
		return res.status(401).json({ message: 'There was a problem authorizing the request' });
	if (user.role !== 'admin')
		return res.status(403).json({ message: 'Role not permitted' });
	req.user = user;
	next();
};

exports.requireSuperAdmin = async (req, res, next) => {
	const user = await verifyToken(req);
	if (!user)
		return res.status(401).json({ message: 'There was a problem authorizing the request' });
	if (user.role !== 'superAdmin')
		return res.status(403).json({ message: 'Role not permitted' });
	req.user = user;
	next();
};

exports.requireAuthorized = async (req, res, next) => {
	const user = await verifyToken(req);
	if (!user)
		return res.status(401).json({ message: 'There was a problem authorizing the request' });
	if (!['admin', 'superAdmin'].includes(user.role))
		return res.status(403).json({ message: 'Role not permitted' });
	req.user = user;
	next();
};

exports.requireAuthenticated = async (req, res, next) => {
	const user = await verifyToken(req);
	if (!user)
		return res.status(401).json({ message: 'There was a problem authorizing the request' });
	if (!['student', 'staff', 'faculty', 'superAdmin', 'admin'].includes(user.role))
		return res.status(403).json({ message: 'Role not permitted' });
	req.user = user;
	next();
};