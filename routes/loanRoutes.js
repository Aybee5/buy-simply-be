const express = require('express');
const { getAllLoans, filterLoans, getUserLoans, getExpiredLoans, deleteLoan } = require('../controllers/loanController');
const authenticate = require('../middlewares/authenticate');
const { authorize } = require('../middlewares/authorize');

const router = express.Router();

router.get('/', authenticate, getAllLoans);
router.get('/:userEmail/get', authenticate, getUserLoans);
router.get('/expired', authenticate, getExpiredLoans);
router.delete('/:loanId/delete', authenticate, authorize(['superAdmin']), deleteLoan);

module.exports = router;
