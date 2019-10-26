const express = require('express');

const auth = require('../models/auth-model');
const trade = require('../models/trade-model');

const router = express.Router();

router.post('/buy',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => trade.buyAsset(req, res)
);
router.post('/sell',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => trade.sellAsset(req, res)
);

module.exports = router;
