const db = require('../db/database');

const accountModel = {
    getHoldings: function (req, res) {
        const accountID = req.user.accountID;
        let query;

        query = `SELECT * FROM account_holdings
                 WHERE account_id = ?`;
        db.all(query, accountID, (err, rows) => {
            if (err) {
                return res.status(500).json({
                    error: {
                        status: 500,
                        message: "Database error"
                    }
                });
            }

            return res.status(200).json({
                data: rows
            });
        });
    },

    makeDeposit: function (req, res) {
        const accountID = req.user.accountID;
        const quantity = req.body.quantity;
        let query;

        query = `SELECT * FROM account_holdings
                 WHERE account_id = ? AND name = ?`;
        db.get(query, accountID, 'Saldo', (err, row) => {
            if (err) {
                return res.status(500).json({
                    error: {
                        status: 500,
                        message: "Database error"
                    }
                });
            }

            // Previous deposit does not exist
            if (!row) {
                query = `INSERT INTO account_holdings (account_id, name, quantity)
                         VALUES (?, ?, ?)`;

                db.run(query, accountID, 'Saldo', quantity, (err) => {
                    if (err) {
                        return res.status(500).json({
                            error: {
                                status: 500,
                                message: "Database error"
                            }
                        });
                    }
                    return res.status(200).json({
                        data: {
                            status: 200,
                            message: "Money successfully deposited"
                        }
                    });
                });
            } else {
                // Previous deposit exists
                query = `UPDATE account_holdings SET quantity = ?
                         WHERE account_id = ? AND name = ?`;
                const newQuantity = +quantity + row.quantity;

                db.run(query, newQuantity, accountID, 'Saldo', (err) => {
                    if (err) {
                        return res.status(500).json({
                            error: {
                                status: 500,
                                message: "Database error"
                            }
                        });
                    }

                    return res.status(200).json({
                        data: {
                            status: 200,
                            message: "Money successfully deposited"
                        }
                    });
                });
            }
        });
    },
};

module.exports = accountModel;
