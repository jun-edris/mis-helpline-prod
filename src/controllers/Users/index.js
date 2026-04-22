const { jwtDecode } = require('jwt-decode');
const User = require('./../../models/user');
const Req = require('./../../models/request');
const { createToken, verifyPassword, hashPassword, pusher } = require('./../../utils');

const isProd = process.env.NODE_ENV === 'production';

const PUBLIC_ROLES = ['student', 'staff', 'faculty'];

const cookieOptions = {
	httpOnly: true,
	secure: isProd,
	sameSite: isProd ? 'strict' : 'lax',
	maxAge: 5 * 60 * 60 * 1000,
};

exports.getRequests = async (req, res) => {
	try {
		const requests = await Req.find({}).populate('user').lean();
		res.status(200).json({ message: 'Successfully fetched requests!', requests });
	} catch (error) {
		console.error('getRequests:', error.message);
		res.status(500).json({ message: 'Something went wrong!' });
	}
};

exports.getRequestCounts = async (req, res) => {
	try {
		const [total, approved, completed, pending, rejected, data, software, hardware, network, other] =
			await Promise.all([
				Req.countDocuments({}),
				Req.countDocuments({ approved: true }),
				Req.countDocuments({ completed: true }),
				Req.countDocuments({ pending: true }),
				Req.countDocuments({ rejected: true }),
				Req.countDocuments({ title: 'data', pending: true }),
				Req.countDocuments({ title: 'software', pending: true }),
				Req.countDocuments({ title: 'hardware', pending: true }),
				Req.countDocuments({ title: 'network', pending: true }),
				Req.countDocuments({ title: 'others', pending: true }),
			]);
		res.status(200).json({ total, approved, completed, pending, rejected, data, software, hardware, network, other });
	} catch (error) {
		console.error('getRequestCounts:', error.message);
		res.status(500).json({ message: 'Something went wrong!' });
	}
};

exports.getUserRequests = async (req, res) => {
	try {
		const requests = await Req.find({ user: req.user.sub }).lean();
		res.status(200).json({ message: 'Successfully fetched requests!', requests });
	} catch (error) {
		console.error('getUserRequests:', error.message);
		res.status(500).json({ message: 'Something went wrong!' });
	}
};

exports.getUserAssignedRequests = async (req, res) => {
	try {
		const requests = await Req.find({ personnel: req.user.sub })
			.populate('user')
			.lean();
		res.status(200).json({ message: 'Successfully fetched requests!', requests });
	} catch (error) {
		console.error('getUserAssignedRequests:', error.message);
		res.status(500).json({ message: 'Something went wrong!' });
	}
};

exports.getCompleteRequests = async (req, res) => {
	try {
		const requests = await Req.find({ completed: true }).populate('user').lean();
		res.status(200).json({ message: 'Successfully fetched requests!', requests });
	} catch (error) {
		console.error('getCompleteRequests:', error.message);
		res.status(500).json({ message: 'Something went wrong!' });
	}
};

exports.getPendingRequests = async (req, res) => {
	try {
		const requests = await Req.find({ pending: true })
			.populate('user')
			.populate('personnel')
			.lean();
		res.status(200).json({ message: 'Successfully fetched requests!', requests });
	} catch (error) {
		console.error('getPendingRequests:', error.message);
		res.status(500).json({ message: 'Something went wrong!' });
	}
};

exports.getRejectedRequests = async (req, res) => {
	try {
		const requests = await Req.find({ rejected: true }).populate('user').lean();
		res.status(200).json({ message: 'Successfully fetched requests!', requests });
	} catch (error) {
		console.error('getRejectedRequests:', error.message);
		res.status(500).json({ message: 'Something went wrong!' });
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email }).select('+password').lean();

		if (!user)
			return res.status(400).json({ message: 'Wrong email or password.' });

		const passwordValid = await verifyPassword(password, user.password);

		if (!passwordValid)
			return res.status(400).json({ message: 'Wrong email or password.' });

		const { password: _pw, ...rest } = user;
		const token = createToken(rest);
		const expiresAt = jwtDecode(token).exp;

		res.cookie('token', token, cookieOptions);
		res.json({ message: 'Authentication successful!', token, userInfo: rest, expiresAt });
	} catch (error) {
		console.error('login:', error.message);
		return res.status(500).json({ message: 'Something went wrong.' });
	}
};

exports.signup = async (req, res) => {
	try {
		const { email, firstName, lastName, contact, role } = req.body;

		if (!PUBLIC_ROLES.includes(role))
			return res.status(400).json({ message: 'Invalid role' });

		const splitedEmail = email.split('@');
		if (splitedEmail[1] !== 'bisu.edu.ph')
			return res.status(400).json({ message: 'Email should be a BISU email!' });

		const existingEmail = await User.findOne({ email: email.toLowerCase() }).lean();
		if (existingEmail)
			return res.status(400).json({ message: 'Email already exists' });

		const hashedPassword = await hashPassword(req.body.password);

		const userData = {
			email: email.toLowerCase(),
			firstName,
			lastName,
			contact,
			password: hashedPassword,
			role,
		};
		if (role === 'staff') userData.office = req.body.office;
		if (role === 'faculty') {
			userData.department = req.body.department;
			userData.office = req.body.office;
		}

		const savedUser = await new User(userData).save();

		pusher.trigger('users', 'created', {
			_id: savedUser._id,
			email: savedUser.email,
			firstName: savedUser.firstName,
			lastName: savedUser.lastName,
			contact: savedUser.contact,
			role: savedUser.role,
		});

		return res.status(201).json({ message: 'Registered successfully' });
	} catch (error) {
		console.error('signup:', error.message);
		res.status(500).json({ message: 'There was a problem creating your account' });
	}
};

exports.request = async (req, res) => {
	try {
		const { title, reqType, description } = req.body;
		const { sub } = req.user;

		const savedRequest = await new Req({ user: sub, title, reqType, description }).save();

		pusher.trigger('request', 'created', savedRequest);
		return res.status(201).json({
			message: 'Request created successfully!',
			_id: savedRequest._id,
			ticketNo: Math.floor(1000 + Math.random() * 9000),
			reqType,
		});
	} catch (error) {
		console.error('request:', error.message);
		res.status(500).json({ message: 'There was a problem creating your request!' });
	}
};

exports.ticket = async (req, res) => {
	try {
		const { ticketNo } = req.body;

		const updated = await Req.findByIdAndUpdate(
			req.params.id,
			{ ticketNo },
			{ new: true }
		);

		if (!updated)
			return res.status(404).json({ message: 'Request not found!' });

		pusher.trigger('request', 'ticket', updated);
		return res.status(200).json({ message: 'Success' });
	} catch (error) {
		console.error('ticket:', error.message);
		res.status(500).json({ message: 'There was a problem updating your request!' });
	}
};

exports.logout = (req, res) => {
	res.clearCookie('token', {
		httpOnly: true,
		secure: isProd,
		sameSite: isProd ? 'strict' : 'lax',
	});
	res.status(200).json({ success: true, message: 'User logged out successfully' });
};

exports.cancelRequest = async (req, res) => {
	try {
		const canceledReq = await Req.findByIdAndDelete(req.params.id);
		if (!canceledReq)
			return res.status(404).json({ message: 'Request not found!' });
		pusher.trigger('request', 'deleted-req', canceledReq);
		res.status(200).json({ message: 'Successfully canceled requests!' });
	} catch (error) {
		console.error('cancelRequest:', error.message);
		res.status(500).json({ message: 'Something went wrong!' });
	}
};