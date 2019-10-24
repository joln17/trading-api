const express = require('express');

const auth = require('../models/auth-model');
const account = require('../models/account-model');

const router = express.Router();

router.get('/holdings',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => account.getHoldings(req, res)
);
router.post('/deposit',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => account.makeDeposit(req, res)
);

module.exports = router;
