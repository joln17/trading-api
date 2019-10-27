/* global describe it */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');

require('../auth/auth_integration');
require('../account/account_integration');

chai.should();

chai.use(chaiHttp);

const user1 = {
    email: "user1@user",
    password: "user1234"
};

let tokenUser1 = '';

const trade1 = {
    name: "bitcoin",
    quantity: "4",
    price: "9000"
};

const trade2 = {
    name: "bitcoin",
    quantity: "4",
    price: "11000"
};

describe('Trade - Login', () => {
    describe('POST /auth/login', () => {
        it('should get 200, user1 logged in', (done) => {
            chai.request(server)
                .post('/auth/login')
                .send(user1)
                .end((err, res) => {
                    tokenUser1 = res.body.data.token;
                    done();
                });
        });
    });
});

describe('Trade', () => {
    describe('POST /trade/buy', () => {
        it('should get 200, successful first buy', (done) => {
            chai.request(server)
                .post('/trade/buy')
                .send(trade1)
                .set('x-access-token', tokenUser1)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.data.should.be.an('object');
                    done();
                });
        });

        it('should get 200, verify first buy', (done) => {
            chai.request(server)
                .get('/account/holdings')
                .set('x-access-token', tokenUser1)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.data.should.be.an('array');
                    res.body.data.length.should.equal(2);
                    res.body.data[0].name.should.equal('Saldo');
                    res.body.data[0].quantity.should.equal(64000);
                    res.body.data[1].name.should.equal('bitcoin');
                    res.body.data[1].quantity.should.equal(4);
                    res.body.data[1].price.should.equal(9000);
                    done();
                });
        });

        it('should get 200, successful second buy', (done) => {
            chai.request(server)
                .post('/trade/buy')
                .send(trade2)
                .set('x-access-token', tokenUser1)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.data.should.be.an('object');
                    done();
                });
        });

        it('should get 200, verify second buy', (done) => {
            chai.request(server)
                .get('/account/holdings')
                .set('x-access-token', tokenUser1)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.data.should.be.an('array');
                    res.body.data.length.should.equal(2);
                    res.body.data[0].name.should.equal('Saldo');
                    res.body.data[0].quantity.should.equal(20000);
                    res.body.data[1].name.should.equal('bitcoin');
                    res.body.data[1].quantity.should.equal(8);
                    res.body.data[1].price.should.equal(10000);
                    done();
                });
        });

        it('should get 400, insufficient funds', (done) => {
            chai.request(server)
                .post('/trade/buy')
                .send(trade2)
                .set('x-access-token', tokenUser1)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.an('object');
                    res.body.error.should.be.an('object');
                    done();
                });
        });

        it('should get 200, verify insufficient funds', (done) => {
            chai.request(server)
                .get('/account/holdings')
                .set('x-access-token', tokenUser1)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.data.should.be.an('array');
                    res.body.data.length.should.equal(2);
                    res.body.data[0].name.should.equal('Saldo');
                    res.body.data[0].quantity.should.equal(20000);
                    res.body.data[1].name.should.equal('bitcoin');
                    res.body.data[1].quantity.should.equal(8);
                    res.body.data[1].price.should.equal(10000);
                    done();
                });
        });
    });

    describe('POST /trade/sell', () => {
        it('should get 200, successful first sell', (done) => {
            chai.request(server)
                .post('/trade/sell')
                .send(trade2)
                .set('x-access-token', tokenUser1)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.data.should.be.an('object');
                    done();
                });
        });

        it('should get 200, verify first sell', (done) => {
            chai.request(server)
                .get('/account/holdings')
                .set('x-access-token', tokenUser1)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.data.should.be.an('array');
                    res.body.data.length.should.equal(2);
                    res.body.data[0].name.should.equal('Saldo');
                    res.body.data[0].quantity.should.equal(64000);
                    res.body.data[1].name.should.equal('bitcoin');
                    res.body.data[1].quantity.should.equal(4);
                    res.body.data[1].price.should.equal(10000);
                    done();
                });
        });

        it('should get 200, successful second sell', (done) => {
            chai.request(server)
                .post('/trade/sell')
                .send(trade1)
                .set('x-access-token', tokenUser1)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.data.should.be.an('object');
                    done();
                });
        });

        it('should get 200, verify second sell', (done) => {
            chai.request(server)
                .get('/account/holdings')
                .set('x-access-token', tokenUser1)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.data.should.be.an('array');
                    res.body.data.length.should.equal(1);
                    res.body.data[0].name.should.equal('Saldo');
                    res.body.data[0].quantity.should.equal(100000);
                    done();
                });
        });

        it('should get 400, no assets', (done) => {
            chai.request(server)
                .post('/trade/sell')
                .send(trade2)
                .set('x-access-token', tokenUser1)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.an('object');
                    res.body.error.should.be.an('object');
                    done();
                });
        });

        it('should get 200, verify no assets', (done) => {
            chai.request(server)
                .get('/account/holdings')
                .set('x-access-token', tokenUser1)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.data.should.be.an('array');
                    res.body.data.length.should.equal(1);
                    res.body.data[0].name.should.equal('Saldo');
                    res.body.data[0].quantity.should.equal(100000);
                    done();
                });
        });
    });
});
