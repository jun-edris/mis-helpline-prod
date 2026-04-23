const express = require('express');
const { completeReq } = require('../controllers/Admin');
const { attachUser, requireAdmin } = require('./../middlewares');
const { validateIdParam } = require('./../middlewares/validate');
const router = express.Router();

router.patch('/request/complete/:id', attachUser, requireAdmin, validateIdParam, completeReq);

module.exports = router;