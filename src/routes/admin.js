const express = require('express');
const { completeReq } = require('../controllers/Admin');
const { requireAdmin } = require('./../middlewares');
const router = express.Router();

router.patch('/request/complete/:id', requireAdmin, completeReq);

module.exports = router;