const express = require('express');
const { completeReq } = require('../controllers/Admin');
const { attachUser, requireAdmin } = require('./../middlewares');
const router = express.Router();

router.patch('/request/complete/:id', attachUser, requireAdmin, completeReq);

module.exports = router;