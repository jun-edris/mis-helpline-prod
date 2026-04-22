const User = require('./../../models/user');
const DataTeam = require('./../../models/dataTeam');
const SoftwareTeam = require('./../../models/softwareTeam');
const HardwareTeam = require('./../../models/hardwareTeam');
const NetworkTeam = require('./../../models/networkTeam');
const OthersTeam = require('./../../models/othersTeam');
const Request = require('./../../models/request');
const { pusher } = require('./../../utils');

const TEAM_MODELS = {
	data: DataTeam,
	software: SoftwareTeam,
	hardware: HardwareTeam,
	network: NetworkTeam,
	others: OthersTeam,
};

exports.getUsers = async (req, res) => {
	try {
		const users = await User.find({
			role: { $in: ['admin', 'faculty', 'staff', 'student'] },
		}).select('_id firstName lastName email contact role');
		res.status(200).json(users);
	} catch (error) {
		console.error('getUsers:', error.message);
		res.status(500).json({ message: 'Cannot get the users' });
	}
};

exports.getAdmins = async (req, res) => {
	try {
		const users = await User.find({ role: 'admin' }).select(
			'_id firstName lastName email contact role'
		);
		res.status(200).json(users);
	} catch (error) {
		console.error('getAdmins:', error.message);
		res.status(500).json({ message: 'Cannot get the admins' });
	}
};

exports.getFaculty = async (req, res) => {
	try {
		const users = await User.find({ role: 'faculty' }).select(
			'_id firstName lastName email contact role department office'
		);
		res.status(200).json(users);
	} catch (error) {
		console.error('getFaculty:', error.message);
		res.status(500).json({ message: 'Cannot get the faculty' });
	}
};

exports.getStudents = async (req, res) => {
	try {
		const users = await User.find({ role: 'student' }).select(
			'_id firstName lastName email contact role'
		);
		res.status(200).json(users);
	} catch (error) {
		console.error('getStudents:', error.message);
		res.status(500).json({ message: 'Cannot get the students' });
	}
};

exports.getStaffs = async (req, res) => {
	try {
		const users = await User.find({ role: 'staff' }).select(
			'_id firstName lastName email contact role office'
		);
		res.status(200).json(users);
	} catch (error) {
		console.error('getStaffs:', error.message);
		res.status(500).json({ message: 'Cannot get the staff' });
	}
};

exports.getTeam = async (req, res) => {
	try {
		const TeamModel = TEAM_MODELS[req.params.type];
		if (!TeamModel)
			return res.status(400).json({ message: 'Invalid team type' });

		const teams = await TeamModel.find({ type: req.params.type }).populate('members');
		res.status(200).json(teams);
	} catch (error) {
		console.error('getTeam:', error.message);
		res.status(500).json({ message: 'Unable to get the team' });
	}
};

exports.team = async (req, res) => {
	try {
		const { type, members } = req.body;
		const TeamModel = TEAM_MODELS[type];
		if (!TeamModel)
			return res.status(400).json({ message: 'Invalid team type' });

		const updatedTeam = await TeamModel.findOneAndUpdate(
			{ type },
			{ $push: { members } },
			{ upsert: true, new: true }
		);
		pusher.trigger('team', 'updated', updatedTeam);
		return res.status(200).json({ message: 'Success!' });
	} catch (error) {
		console.error('team:', error.message);
		res.status(500).json({ message: 'Something went wrong!' });
	}
};

exports.changeToAdmin = async (req, res) => {
	try {
		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{ role: 'admin' },
			{ new: true }
		);
		if (!updatedUser)
			return res.status(404).json({ message: 'User not found' });

		pusher.trigger('users', 'updated', updatedUser);
		res.status(200).json({ message: 'A user is successfully turned into Admin!' });
	} catch (error) {
		console.error('changeToAdmin:', error.message);
		res.status(500).json({ message: 'Error changing the role' });
	}
};

exports.deleteUser = async (req, res) => {
	try {
		const deletedUser = await User.findByIdAndDelete(req.params.id);
		if (!deletedUser)
			return res.status(404).json({ message: 'User not found' });

		await Request.deleteMany({ user: req.params.id });

		pusher.trigger('users', 'deleted-user', deletedUser);
		res.status(200).json({ message: 'A user is successfully deleted!' });
	} catch (error) {
		console.error('deleteUser:', error.message);
		res.status(500).json({ message: 'Something went wrong.' });
	}
};

exports.deleteMember = async (req, res) => {
	try {
		const TeamModel = TEAM_MODELS[req.params.data];
		if (!TeamModel)
			return res.status(400).json({ message: 'Invalid team type' });

		const updatedTeam = await TeamModel.findOneAndUpdate(
			{ type: req.params.data },
			{ $pull: { members: req.params.id } },
			{ new: true }
		);
		pusher.trigger('team', 'updated', updatedTeam);
		return res.status(200).json({ message: 'Success!' });
	} catch (error) {
		console.error('deleteMember:', error.message);
		res.status(500).json({ message: 'Something went wrong.' });
	}
};

exports.approveReq = async (req, res) => {
	try {
		const { personel } = req.body;

		const approvedReq = await Request.findByIdAndUpdate(
			req.params.id,
			{ approved: true, pending: true, personel },
			{ new: true }
		);

		if (!approvedReq)
			return res.status(404).json({ message: 'Request not found' });

		pusher.trigger('request', 'approved', approvedReq);
		res.status(200).json({ message: 'Success' });
	} catch (error) {
		console.error('approveReq:', error.message);
		res.status(500).json({ message: 'Error approving the request' });
	}
};

exports.rejectReq = async (req, res) => {
	try {
		const { reason } = req.body;

		const rejectedReq = await Request.findByIdAndUpdate(
			req.params.id,
			{ reason, rejected: true, pending: false },
			{ new: true }
		);

		if (!rejectedReq)
			return res.status(404).json({ message: 'Request not found' });

		pusher.trigger('request', 'rejected', rejectedReq);
		res.status(200).json({ message: 'Success' });
	} catch (error) {
		console.error('rejectReq:', error.message);
		res.status(500).json({ message: 'Something went wrong!' });
	}
};