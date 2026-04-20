const { jwtDecode } = require('jwt-decode');
const User = require('./../../models/user');
const Req = require('./../../models/request');
const { createToken, verifyPassword, hashPassword, pusher } = require('./../../utils');

exports.getRequests = async (req, res) => {
	try {
		const requests = await Req.find({}).populate('user').lean();
		res.status(200).json({ message: 'Successfully fetched requests!', requests });
	} catch {
		res.status(400).json({ message: 'Something went wrong!' });
	}
};

exports.getReqCount = async (req, res) => {
	try {
		const requests = await Req.countDocuments({});
		res.status(200).json({ message: 'Successfully fetched requests!', requests });
	} catch {
		res.status(400).json({ message: 'Something went wrong!' });
	}
};

exports.getUserRequests = async (req, res) => {
	try {
		const requests = await Req.find({ user: req.user.sub }).lean();
		res.status(200).json({ message: 'Successfully fetched requests!', requests });
	} catch {
		res.status(400).json({ message: 'Something went wrong!' });
	}
};

exports.getUserAssignedRequests = async (req, res) => {
	try {
		const requests = await Req.find({ personel: req.user.sub })
			.populate('user')
			.lean();
		res.status(200).json({ message: 'Successfully fetched requests!', requests });
	} catch {
		res.status(400).json({ message: 'Something went wrong!' });
	}
};

exports.getCompleteRequests = async (req, res) => {
	try {
		const requests = await Req.find({ completed: true }).populate('user').lean();
		res.status(200).json({ message: 'Successfully fetched requests!', requests });
	} catch {
		res.status(400).json({ message: 'Something went wrong!' });
	}
};

exports.getApproveReqCount = async (req, res) => {
	try {
		const requests = await Req.countDocuments({ approved: true });
		res.status(200).json({ message: 'Successfully fetched requests!', requests });
	} catch {
		res.status(400).json({ message: 'Something went wrong!' });
	}
};

exports.getCompleteReqCount = async (req, res) => {
	try {
		const requests = await Req.countDocuments({ completed: true });
		res.status(200).json({ message: 'Successfully fetched requests!', requests });
	} catch {
		res.status(400).json({ message: 'Something went wrong!' });
	}
};

exports.getPendingRequests = async (req, res) => {
	try {
		const requests = await Req.find({ pending: true })
			.populate('user')
			.populate('personel')
			.lean();
		res.status(200).json({ message: 'Successfully fetched requests!', requests });
	} catch {
		res.status(400).json({ message: 'Something went wrong!' });
	}
};

exports.getPendingReqCount = async (req, res) => {
	try {
		const requests = await Req.countDocuments({ pending: true });
		res.status(200).json({ message: 'Successfully fetched requests!', requests });
	} catch {
		res.status(400).json({ message: 'Something went wrong!' });
	}
};

exports.getRejectedRequests = async (req, res) => {
	try {
		const requests = await Req.find({ rejected: true }).populate('user').lean();
		res.status(200).json({ message: 'Successfully fetched requests!', requests });
	} catch {
		res.status(400).json({ message: 'Something went wrong!' });
	}
};

exports.getRejectedReqCount = async (req, res) => {
	try {
		const requests = await Req.countDocuments({ rejected: true });
		res.status(200).json({ message: 'Successfully fetched requests!', requests });
	} catch {
		res.status(400).json({ message: 'Something went wrong!' });
	}
};

exports.getDataReqCount = async (req, res) => {
	try {
		const requests = await Req.countDocuments({ title: 'data', pending: true });
		res.status(200).json({ message: 'Successfully fetched requests!', requests });
	} catch {
		res.status(400).json({ message: 'Something went wrong!' });
	}
};

exports.getSoftwareReqCount = async (req, res) => {
	try {
		const requests = await Req.countDocuments({ title: 'software', pending: true });
		res.status(200).json({ message: 'Successfully fetched requests!', requests });
	} catch {
		res.status(400).json({ message: 'Something went wrong!' });
	}
};

exports.getHardwareReqCount = async (req, res) => {
	try {
		const requests = await Req.countDocuments({ title: 'hardware', pending: true });
		res.status(200).json({ message: 'Successfully fetched requests!', requests });
	} catch {
		res.status(400).json({ message: 'Something went wrong!' });
	}
};

exports.getNetworkReqCount = async (req, res) => {
	try {
		const requests = await Req.countDocuments({ title: 'network', pending: true });
		res.status(200).json({ message: 'Successfully fetched requests!', requests });
	} catch {
		res.status(400).json({ message: 'Something went wrong!' });
	}
};

exports.getOtherReqCount = async (req, res) => {
	try {
		const requests = await Req.countDocuments({ title: 'others', pending: true });
		res.status(200).json({ message: 'Successfully fetched requests!', requests });
	} catch {
		res.status(400).json({ message: 'Something went wrong!' });
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

		res.cookie('token', token, { httpOnly: true });
		res.json({ message: 'Authentication successful!', token, userInfo: rest, expiresAt });
	} catch {
		return res.status(400).json({ message: 'Something went wrong.' });
	}
};

exports.signup = async (req, res) => {
	try {
		const { email, firstName, lastName, contact, role } = req.body;

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
	} catch {
		res.status(400).json({ message: 'There was a problem creating your account' });
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
	} catch {
		res.status(400).json({ message: 'There was a problem creating your request!' });
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
	} catch {
		res.status(400).json({ message: 'There was a problem updating your request!' });
	}
};

exports.logout = (req, res) => {
	res.clearCookie('token', { httpOnly: true });
	res.status(200).json({ success: true, message: 'User logged out successfully' });
};

exports.cancelRequest = async (req, res) => {
	try {
		const canceledReq = await Req.findByIdAndDelete(req.params.id);
		if (!canceledReq)
			return res.status(404).json({ message: 'Request not found!' });
		pusher.trigger('request', 'deleted-req', canceledReq);
		res.status(200).json({ message: 'Successfully canceled requests!' });
	} catch {
		res.status(400).json({ message: 'Something went wrong!' });
	}
};
