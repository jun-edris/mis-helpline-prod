const { body, param, validationResult } = require('express-validator');

const TICKET_TITLES = ['data', 'software', 'hardware', 'network', 'others'];
const TEAM_TYPES = ['data', 'software', 'hardware', 'network', 'others'];
const PUBLIC_ROLES = ['student', 'staff', 'faculty'];

const handleValidation = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty())
		return res.status(422).json({ message: errors.array()[0].msg });
	next();
};

const mongoId = (field, location = 'param') =>
	(location === 'param' ? param(field) : body(field))
		.isMongoId()
		.withMessage(`Invalid ${field}`);

exports.validateLogin = [
	body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
	body('password').notEmpty().withMessage('Password is required'),
	handleValidation,
];

exports.validateSignup = [
	body('firstName').trim().notEmpty().withMessage('First name is required').isLength({ max: 50 }).withMessage('First name too long'),
	body('lastName').trim().notEmpty().withMessage('Last name is required').isLength({ max: 50 }).withMessage('Last name too long'),
	body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
	body('contact').trim().notEmpty().withMessage('Contact is required').isLength({ min: 10, max: 20 }).withMessage('Contact must be 10–20 characters'),
	body('role').isIn(PUBLIC_ROLES).withMessage('Invalid role'),
	body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
	handleValidation,
];

exports.validateRequest = [
	body('title').isIn(TICKET_TITLES).withMessage('Invalid request title'),
	body('reqType').trim().notEmpty().withMessage('Request type is required').isLength({ max: 100 }).withMessage('Request type too long'),
	body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 1000 }).withMessage('Description too long'),
	handleValidation,
];

exports.validateTicket = [
	mongoId('id'),
	body('ticketNo').isInt({ min: 1000, max: 9999 }).withMessage('Invalid ticket number'),
	handleValidation,
];

exports.validateIdParam = [
	mongoId('id'),
	handleValidation,
];

exports.validateApprove = [
	mongoId('id'),
	body('personnel').isMongoId().withMessage('Invalid personnel ID'),
	handleValidation,
];

exports.validateReject = [
	mongoId('id'),
	body('reason').trim().notEmpty().withMessage('Rejection reason is required').isLength({ max: 500 }).withMessage('Reason too long'),
	handleValidation,
];

exports.validateTeam = [
	body('type').isIn(TEAM_TYPES).withMessage('Invalid team type'),
	body('members').isMongoId().withMessage('Invalid member ID'),
	handleValidation,
];

exports.validateTeamMemberParam = [
	mongoId('id'),
	param('data').isIn(TEAM_TYPES).withMessage('Invalid team type'),
	handleValidation,
];
