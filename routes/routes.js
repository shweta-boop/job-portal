const express = require('express');
const router = express.Router({ mergeParams: true });
const Job = require('../models/job.model.js');
const jobController = require('../controllers/job_controller.js');
const authController = require('../controllers/auth_controller.js');
const middleware = require('../middleware/ValidateSession.js');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/dashboard', middleware.validateSession, authController.getDashboard);
router.post('/seed-jobs',middleware.validateSession, authController.seedJobs);
router.post('/apply-job', middleware.validateSession, jobController.applyJob);
router.get('/applied-jobs', middleware.validateSession, jobController.getAppliedJobs);
router.post('/create-job', middleware.isAdmin, jobController.createJob);
router.get('/getJobStats', middleware.validateSession, jobController.getJobStats);

module.exports = router;
