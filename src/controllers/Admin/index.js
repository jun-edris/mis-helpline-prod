const Request = require('./../../models/request');
const { pusher } = require('./../../utils');

exports.completeReq = async (req, res) => {
	try {
		const completed = await Request.findByIdAndUpdate(
			req.params.id,
			{ completed: true, pending: false },
			{ new: true }
		);

		if (!completed)
			return res.status(404).json({ message: 'Request not found' });

		pusher.trigger('request', 'updated', completed);
		res.status(200).json({ message: 'A request has been completed!' });
	} catch {
		res.status(400).json({ message: 'Error completing the request' });
	}
};