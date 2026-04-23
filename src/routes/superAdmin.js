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
const { requireSuperAdmin } = require('./../middlewares');
const router = express.Router();

router.get('/users', requireSuperAdmin, getUsers);
router.get('/users/admins', requireSuperAdmin, getAdmins);
router.get('/users/student', requireSuperAdmin, getStudents);
router.get('/users/staff', requireSuperAdmin, getStaffs);
router.get('/users/faculty', requireSuperAdmin, getFaculty);
router.get('/teams/:type', requireSuperAdmin, getTeam);
router.patch('/teams', requireSuperAdmin, team);
router.patch('/teams/:id/:data', requireSuperAdmin, deleteMember);
router.patch('/users/admin/:id', requireSuperAdmin, changeToAdmin);
router.patch('/request/approve/:id', requireSuperAdmin, approveReq);
router.patch('/request/reject/:id', requireSuperAdmin, rejectReq);
router.delete('/users/:id', requireSuperAdmin, deleteUser);

module.exports = router;