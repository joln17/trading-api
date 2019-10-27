/* global describe it */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');

chai.should();

chai.use(chaiHttp);

const user1 = {
    email: "user1@user",
    password: "user1234",
    name: "User One",
    birthdate: "1970-01-01"
};

const user2 = {
    email: "user2@user",
    password: "user1234",
    name: "User Two",
    birthdate: "1970-01-01"
};

const invalidPass = {
    email: "invalid@invalid",
    password: "user123",
    name: "",
    birthdate: ""
};

const wrongPass = {
    email: "user@user",
    password: "user12345",
    name: "",
    birthdate: ""
};

let tokenUser1 = '';


describe('Auth', () => {
    describe('POST /auth/register', () => {
        it('should get 201, user created', (done) => {
            chai.request(server)
                .post('/auth/register')
                .send(user1)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an('object');
                    res.body.data.should.be.an('object');
                    res.body.data.token.should.be.a('string');
                    tokenUser1 = res.body.data.token;
                    done();
                });
        });

        it('should get 201, second user created', (done) => {
            chai.request(server)
                .post('/auth/register')
                .send(user2)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an('object');
                    res.body.data.should.be.an('object');
                    res.body.data.token.should.be.a('string');
                    done();
                });
        });

        it('should get 401, invalid user/pass', (done) => {
            chai.request(server)
                .post('/auth/register')
                .send(invalidPass)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });

        it('should get 400, user already registered', (done) => {
            chai.request(server)
                .post('/auth/register')
                .send(user1)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    });

    describe('POST /auth/login', () => {
        it('should get 401, invalid user', (done) => {
            chai.request(server)
                .post('/auth/login')
                .send(invalidPass)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });

        it('should get 401, invalid email/password', (done) => {
            chai.request(server)
                .post('/auth/login')
                .send(wrongPass)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });

    describe('GET /auth/verify-login', () => {
        it('should get 200, user logged in', (done) => {
            chai.request(server)
                .get('/auth/verify-login')
                .set('x-access-token', tokenUser1)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});
