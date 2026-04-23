const express = require('express');
const {
	login,
	logout,
	signup,
	request,
	ticket,
	getRequests,
	getUserRequests,
	getUserAssignedRequests,
	getCompleteRequests,
	getPendingRequests,
	getRejectedRequests,
	cancelRequest,
	getRequestCounts,
} = require('../controllers/Users');
const { attachUser, requireAuthenticated } = require('./../middlewares');
const {
	validateLogin,
	validateSignup,
	validateRequest,
	validateTicket,
	validateIdParam,
} = require('./../middlewares/validate');
const router = express.Router();

router.get('/requests', attachUser, requireAuthenticated, getRequests);
router.get('/requests/counts', attachUser, requireAuthenticated, getRequestCounts);
router.get('/requests/mine', attachUser, requireAuthenticated, getUserRequests);
router.get('/requests/assigned', attachUser, requireAuthenticated, getUserAssignedRequests);
router.get('/requests/completed', attachUser, requireAuthenticated, getCompleteRequests);
router.get('/requests/pending', attachUser, requireAuthenticated, getPendingRequests);
router.get('/requests/rejected', attachUser, requireAuthenticated, getRejectedRequests);
router.post('/login', validateLogin, login);
router.post('/signup', validateSignup, signup);
router.post('/requests', attachUser, requireAuthenticated, validateRequest, request);
router.patch('/request/:id', attachUser, requireAuthenticated, validateTicket, ticket);
router.delete('/request/:id', attachUser, requireAuthenticated, validateIdParam, cancelRequest);
router.post('/logout', logout);

module.exports = router;