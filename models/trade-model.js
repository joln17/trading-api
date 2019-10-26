const db = require('../db/database');

const tradeModel = {
    buyAsset: function (req, res) {
        const accountID = req.user.accountID;
        const name = req.body.name;
        const quantity = +req.body.quantity;
        const price = +req.body.price;
        let newQuantity, newPrice, query;

        db.serialize(() => {
            db.run('BEGIN;');

            query = `SELECT * FROM account_holdings
                     WHERE account_id = ? AND name = ?`;
            db.get(query, accountID, 'Saldo', (err, row) => {
                if (err) {
                    db.run("ROLLBACK;");
                    return res.status(500).json({
                        error: {
                            status: 500,
                            message: "Database error"
                        }
                    });
                }
                newQuantity = row ? row.quantity - quantity * price : 0 - quantity * price;

                // Insufficient funds
                if (newQuantity < 0) {
                    db.run("ROLLBACK;");
                    return res.status(400).json({
                        error: {
                            status: 400,
                            message: "Insufficient funds"
                        }
                    });
                } else {
                    // Sufficient funds, update account
                    query = `UPDATE account_holdings SET quantity = ?
                             WHERE account_id = ? AND name = ?`;

                    db.run(query, newQuantity, accountID, 'Saldo', (err) => {
                        if (err) {
                            db.run("ROLLBACK;");
                            return res.status(500).json({
                                error: {
                                    status: 500,
                                    message: "Database error"
                                }
                            });
                        }

                        query = `SELECT * FROM account_holdings
                                 WHERE account_id = ? AND name = ?`;

                        db.get(query, accountID, name, (err, row) => {
                            if (err) {
                                db.run("ROLLBACK;");
                                return res.status(500).json({
                                    error: {
                                        status: 500,
                                        message: "Database error"
                                    }
                                });
                            }

                            if (!row) {
                                query = `INSERT INTO account_holdings (
                                             account_id, name, quantity, price
                                         )
                                         VALUES (?, ?, ?, ?)`;

                                db.run(query, accountID, name, quantity, price, (err) => {
                                    if (err) {
                                        db.run("ROLLBACK;");
                                        return res.status(500).json({
                                            error: {
                                                status: 500,
                                                message: "Database error"
                                            }
                                        });
                                    }

                                    db.run('COMMIT;');
                                    return res.status(200).json({
                                        data: {
                                            status: 200,
                                            message: "Successful transaction"
                                        }
                                    });
                                });
                            } else {
                                newQuantity = row.quantity + quantity;
                                newPrice = ((row.quantity * row.price + quantity * price) /
                                    (row.quantity + quantity)).toFixed(2);
                                query = `UPDATE account_holdings SET quantity = ?, price = ?
                                         WHERE account_id = ? AND name = ?`;

                                db.run(query, newQuantity, newPrice, accountID, name, (err) => {
                                    if (err) {
                                        db.run("ROLLBACK;");
                                        return res.status(500).json({
                                            error: {
                                                status: 500,
                                                message: "Database error"
                                            }
                                        });
                                    }

                                    db.run('COMMIT;');
                                    return res.status(200).json({
                                        data: {
                                            status: 200,
                                            message: "Successful transaction"
                                        }
                                    });
                                });
                            }
                        });
                    });
                }
            });
        });
    },

    sellAsset: function (req, res) {
        const accountID = req.user.accountID;
        const name = req.body.name;
        const quantity = +req.body.quantity;
        const price = +req.body.price;
        let newQuantity, query;

        db.serialize(() => {
            db.run('BEGIN;');

            query = `SELECT * FROM account_holdings
                     WHERE account_id = ? AND name = ?`;
            db.get(query, accountID, name, (err, row) => {
                if (err) {
                    db.run("ROLLBACK;");
                    return res.status(500).json({
                        error: {
                            status: 500,
                            message: "Database error"
                        }
                    });
                }
                newQuantity = row ? row.quantity - quantity : 0 - quantity;

                // Insufficient funds
                if (newQuantity < 0) {
                    db.run("ROLLBACK;");
                    return res.status(400).json({
                        error: {
                            status: 400,
                            message: "Insufficient funds"
                        }
                    });
                } else if (row.quantity - quantity === 0) {
                    query = `DELETE FROM account_holdings
                             WHERE account_id = ? AND name = ?`;

                    db.run(query, accountID, name, (err) => {
                        if (err) {
                            db.run("ROLLBACK;");
                            return res.status(500).json({
                                error: {
                                    status: 500,
                                    message: "Database error"
                                }
                            });
                        }

                        db.run('COMMIT;');
                        return res.status(200).json({
                            data: {
                                status: 200,
                                message: "Successful transaction"
                            }
                        });
                    });
                } else {
                    // Sufficient funds, update account
                    query = `UPDATE account_holdings SET quantity = ?
                             WHERE account_id = ? AND name = ?`;

                    db.run(query, newQuantity, accountID, name, (err) => {
                        if (err) {
                            db.run("ROLLBACK;");
                            return res.status(500).json({
                                error: {
                                    status: 500,
                                    message: "Database error"
                                }
                            });
                        }

                        query = `SELECT * FROM account_holdings
                                 WHERE account_id = ? AND name = ?`;

                        db.get(query, accountID, 'Saldo', (err, row) => {
                            if (err) {
                                db.run("ROLLBACK;");
                                return res.status(500).json({
                                    error: {
                                        status: 500,
                                        message: "Database error"
                                    }
                                });
                            }

                            if (!row) {
                                query = `INSERT INTO account_holdings (
                                             account_id, name, quantity
                                         )
                                         VALUES (?, ?, ?)`;

                                db.run(query, accountID, 'Saldo', quantity * price, (err) => {
                                    if (err) {
                                        db.run("ROLLBACK;");
                                        return res.status(500).json({
                                            error: {
                                                status: 500,
                                                message: "Database error"
                                            }
                                        });
                                    }

                                    db.run('COMMIT;');
                                    return res.status(200).json({
                                        data: {
                                            status: 200,
                                            message: "Successful transaction"
                                        }
                                    });
                                });
                            } else {
                                newQuantity = (row.quantity + quantity * price).toFixed(2);
                                query = `UPDATE account_holdings SET quantity = ?
                                         WHERE account_id = ? AND name = ?`;

                                db.run(query, newQuantity, accountID, 'Saldo', (err) => {
                                    if (err) {
                                        db.run("ROLLBACK;");
                                        return res.status(500).json({
                                            error: {
                                                status: 500,
                                                message: "Database error"
                                            }
                                        });
                                    }

                                    db.run('COMMIT;');
                                    return res.status(200).json({
                                        data: {
                                            status: 200,
                                            message: "Successful transaction"
                                        }
                                    });
                                });
                            }
                        });
                    });
                }
            });
        });
    }
};

module.exports = tradeModel;
