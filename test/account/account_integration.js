/* global describe it */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');

require('../auth/auth_integration');

chai.should();

chai.use(chaiHttp);

const user1 = {
    email: "user1@user",
    password: "user1234"
};

const user2 = {
    email: "user2@user",
    password: "user1234"
};

let tokenUser1 = '', tokenUser2 = '';

const deposit = {
    quantity: "50000"
};

describe('Account - Login', () => {
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

        it('should get 200, user2 logged in', (done) => {
            chai.request(server)
                .post('/auth/login')
                .send(user2)
                .end((err, res) => {
                    tokenUser2 = res.body.data.token;
                    done();
                });
        });
    });
});

describe('Account', () => {
    describe('POST /account/deposit', () => {
        it('should get 200, successful first deposit', (done) => {
            chai.request(server)
                .post('/account/deposit')
                .send(deposit)
                .set('x-access-token', tokenUser1)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.data.should.be.an('object');
                    done();
                });
        });

        it('should get 200, successful second deposit', (done) => {
            chai.request(server)
                .post('/account/deposit')
                .send(deposit)
                .set('x-access-token', tokenUser1)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.data.should.be.an('object');
                    done();
                });
        });
    });
});

describe('Account', () => {
    describe('GET /account/holdings', () => {
        it('should get 200, balance exist', (done) => {
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

        it('should get 200, no deposits made', (done) => {
            chai.request(server)
                .get('/account/holdings')
                .set('x-access-token', tokenUser2)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.data.should.be.an('array');
                    res.body.data.length.should.equal(0);
                    done();
                });
        });
    });
});
