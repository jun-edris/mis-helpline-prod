const express = require('express');
const {
	getUsers,
	getAdmins,
	getFaculty,
	getStaffs,
	getStudents,
	getTeam,
	changeToAdmin,
	deleteUser,
	approveReq,
	rejectReq,
	team,
	deleteMember,
} = require('../controllers/Super Admin');
const { attachUser, requireSuperAdmin } = require('./../middlewares');
const {
	validateIdParam,
	validateApprove,
	validateReject,
	validateTeam,
	validateTeamMemberParam,
} = require('./../middlewares/validate');
const router = express.Router();

router.get('/users', attachUser, requireSuperAdmin, getUsers);
router.get('/users/admins', attachUser, requireSuperAdmin, getAdmins);
router.get('/users/student', attachUser, requireSuperAdmin, getStudents);
router.get('/users/staff', attachUser, requireSuperAdmin, getStaffs);
router.get('/users/faculty', attachUser, requireSuperAdmin, getFaculty);
router.get('/teams/:type', attachUser, requireSuperAdmin, getTeam);
router.patch('/teams', attachUser, requireSuperAdmin, validateTeam, team);
router.patch('/teams/:id/:data', attachUser, requireSuperAdmin, validateTeamMemberParam, deleteMember);
router.patch('/users/admin/:id', attachUser, requireSuperAdmin, validateIdParam, changeToAdmin);
router.patch('/request/approve/:id', attachUser, requireSuperAdmin, validateApprove, approveReq);
router.patch('/request/reject/:id', attachUser, requireSuperAdmin, validateReject, rejectReq);
router.delete('/users/:id', attachUser, requireSuperAdmin, validateIdParam, deleteUser);

module.exports = router;