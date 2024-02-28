const router = require('express').Router();

const userController = require('./controllers/user');
const reportController = require('./controllers/reports');

router.get('/reports/dashboard', userController.authenticateUser, reportController.getDashboardData);
router.get('/reports/daily', userController.authenticateUser, reportController.getDailyReportData);
router.get('/reports/start', userController.authenticateUser, reportController.getMonthStartValue);

module.exports = router;
