CREATE TABLE IF NOT EXISTS accounts (
    account_id INTEGER PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(60) NOT NULL,
    name VARCHAR(255) NOT NULL,
    birthdate DATE NOT NULL,
    UNIQUE(email)
);

CREATE TABLE IF NOT EXISTS account_holdings (
    account_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    quantity NUMERIC NOT NULL,
    price NUMERIC
);

--CREATE TABLE IF NOT EXISTS trade_log (
--    account_id INTEGER NOT NULL,
--    time DATETIME NOT NULL,
--    action VARCHAR(12) NOT NULL,
--    name VARCHAR(255) NOT NULL,
--    quantity NUMERIC NOT NULL,
--    price NUMERIC
--);
