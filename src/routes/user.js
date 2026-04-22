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
const router = express.Router();

router.get('/requests', attachUser, requireAuthenticated, getRequests);
router.get('/requests/counts', attachUser, requireAuthenticated, getRequestCounts);
router.get('/requests/mine', attachUser, requireAuthenticated, getUserRequests);
router.get('/requests/assigned', attachUser, requireAuthenticated, getUserAssignedRequests);
router.get('/requests/completed', attachUser, requireAuthenticated, getCompleteRequests);
router.get('/requests/pending', attachUser, requireAuthenticated, getPendingRequests);
router.get('/requests/rejected', attachUser, requireAuthenticated, getRejectedRequests);
router.post('/login', login);
router.post('/signup', signup);
router.post('/requests', attachUser, requireAuthenticated, request);
router.patch('/request/:id', attachUser, requireAuthenticated, ticket);
router.delete('/request/:id', attachUser, requireAuthenticated, cancelRequest);
router.post('/logout', logout);

module.exports = router;