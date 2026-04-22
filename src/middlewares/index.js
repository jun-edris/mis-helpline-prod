const jwt = require('jsonwebtoken');

const verifyToken = (req) => {
	const token = req.cookies.token;
	if (!token) return null;
	try {
		return jwt.verify(token, process.env.JWT_SECRET_KEY, {
			algorithms: ['HS256'],
			issuer: 'api.mishelpline',
			audience: 'api.mishelpline',
		});
	} catch {
		return null;
	}
};

exports.attachUser = (req, res, next) => {
	const user = verifyToken(req);
	if (!user)
		return res.status(401).json({ message: 'Authentication Invalid' });
	req.user = user;
	next();
};

exports.requireAdmin = (req, res, next) => {
	const user = verifyToken(req);
	if (!user)
		return res.status(401).json({ message: 'There was a problem authorizing the request' });
	if (user.role !== 'admin')
		return res.status(403).json({ message: 'Role not permitted' });
	req.user = user;
	next();
};

exports.requireSuperAdmin = (req, res, next) => {
	const user = verifyToken(req);
	if (!user)
		return res.status(401).json({ message: 'There was a problem authorizing the request' });
	if (user.role !== 'superAdmin')
		return res.status(403).json({ message: 'Role not permitted' });
	req.user = user;
	next();
};

exports.requireAuthorized = (req, res, next) => {
	const user = verifyToken(req);
	if (!user)
		return res.status(401).json({ message: 'There was a problem authorizing the request' });
	if (!['admin', 'superAdmin'].includes(user.role))
		return res.status(403).json({ message: 'Role not permitted' });
	req.user = user;
	next();
};

exports.requireAuthenticated = (req, res, next) => {
	const user = verifyToken(req);
	if (!user)
		return res.status(401).json({ message: 'There was a problem authorizing the request' });
	if (!['student', 'staff', 'faculty', 'superAdmin', 'admin'].includes(user.role))
		return res.status(403).json({ message: 'Role not permitted' });
	req.user = user;
	next();
};