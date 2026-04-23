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
const { requireAuthenticated } = require('./../middlewares');
const router = express.Router();

router.get('/requests', requireAuthenticated, getRequests);
router.get('/requests/counts', requireAuthenticated, getRequestCounts);
router.get('/requests/mine', requireAuthenticated, getUserRequests);
router.get('/requests/assigned', requireAuthenticated, getUserAssignedRequests);
router.get('/requests/completed', requireAuthenticated, getCompleteRequests);
router.get('/requests/pending', requireAuthenticated, getPendingRequests);
router.get('/requests/rejected', requireAuthenticated, getRejectedRequests);
router.post('/login', login);
router.post('/signup', signup);
router.post('/requests', requireAuthenticated, request);
router.patch('/request/:id', requireAuthenticated, ticket);
router.delete('/request/:id', requireAuthenticated, cancelRequest);
router.post('/logout', logout);

module.exports = router;