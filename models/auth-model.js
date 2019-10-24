const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const secret = process.env.JWT_SECRET;
const db = require('../db/database');

const authModel = {
    register: function (req, res) {
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;
        const birthdate = req.body.birthdate;
        let query;

        if (!email || !password || password.length < 8) {
            return res.status(401).json({
                error: {
                    status: 401,
                    message: "Email or password not valid"
                }
            });
        }

        query = `SELECT email FROM accounts WHERE email = ?`;
        db.get(query, email, (err, row) => {
            if (err) {
                return res.status(500).json({
                    error: {
                        status: 500,
                        message: "Database error"
                    }
                });
            }
            if (row) {
                return res.status(400).json({
                    error: {
                        status: 400,
                        message: "Email is already registered"
                    }
                });
            }

            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: {
                            status: 500,
                            message: "Bcrypt error"
                        }
                    });
                }

                query = `INSERT INTO accounts (email, password, name, birthdate)
                         VALUES (?, ?, ?, ?)`;

                db.run(query, email, hash, name, birthdate, function (err) {
                    if (err) {
                        return res.status(500).json({
                            error: {
                                status: 500,
                                message: "Database error"
                            }
                        });
                    }

                    const payload = { accountID: this.lastID, email: email };
                    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

                    return res.status(201).json({
                        data: {
                            status: 201,
                            message: "User successfully registered",
                            token: token
                        }
                    });
                });
            });
        });
    },

    login: function (req, res) {
        const email = req.body.email;
        const password = req.body.password;
        let query;

        query = `SELECT * FROM accounts WHERE email = ?`;
        db.get(query, email, (err, row) => {
            if (err) {
                return res.status(500).json({
                    error: {
                        status: 500,
                        message: "Database error"
                    }
                });
            }
            if (!row) {
                return res.status(401).json({
                    error: {
                        status: 401,
                        message: "Email or password is wrong"
                    }
                });
            }

            bcrypt.compare(password, row.password, (err, isPasswordCorrect) => {
                if (err) {
                    return res.status(500).json({
                        error: {
                            status: 500,
                            message: "Bcrypt error"
                        }
                    });
                }
                if (!isPasswordCorrect) {
                    return res.status(401).json({
                        error: {
                            status: 401,
                            message: "Email or password is wrong"
                        }
                    });
                }

                const payload = { accountID: row.account_id, email: email };
                const token = jwt.sign(payload, secret, { expiresIn: '1h' });

                return res.status(200).json({
                    data: {
                        status: 200,
                        message: "User logged in",
                        token: token
                    }
                });
            });
        });
    },

    checkToken: function (req, res, next) {
        const token = req.headers['x-access-token'];

        if (token) {
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            message: "Failed authentication"
                        }
                    });
                }

                req.user = {
                    accountID: decoded.accountID,
                    email: decoded.email
                };

                next();
                return;
            });
        } else {
            return res.status(401).json({
                errors: {
                    status: 401,
                    message: "No token provided"
                }
            });
        }
    },
};

module.exports = authModel;
