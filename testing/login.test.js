const assert = require('assert');
const index = require('../index.js');
const test = require('supertest');

describe('Test to check if a user can log in with correct details and to check false details are rejected', () => {
    it ('Should login with correct details', function(done){
        const username = 'admin';
        const password = 'password';
        test(index)
        .post('/loginform')
        .send({username, password})
        .end((err, res) => {
            if (err) {
                console.error(err);
                done(err);
            } else {
                assert.equal(res.headers.location, '/home');
                done();
            }
        });
    });
    it ('Should not login with incorrect details', function(done){
        const username = 'admin';
        const password = 'wordpass';
        test(index)
        .post('/loginform')
        .send({username, password})
        .end((err, res) => {
            if (err) {
                console.error(err);
                done(err);
            } else {
                assert.equal(res.send("Username and/or password incorrect"));
                done();
            }
        });
    });
});

