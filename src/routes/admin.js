const express = require('express');
const { completeReq } = require('../controllers/Admin');
const { checkJwt, attachUser, requireAdmin } = require('./../middlewares');
const router = express.Router();

router.patch(
	'/request/complete/:id',
	attachUser,
	checkJwt,
	requireAdmin,
	completeReq
);

module.exports = router;
