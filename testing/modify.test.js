const assert = require('assert');
const index = require('../index.js');
const test = require('supertest');

describe('Test to check if data can be modified', () => {
    it ('The product should be modified with the quantity increasing', function(done){
        const ID = '97' 
        const Quantity = '2'
        const username = 'testuser'
        test(index)
        .post('/incomingModify')
        .send({ID, Quantity, username})
        .end((err, res) => {
            if (err) {
                console.error(err);
                done(err);
            } else {
                //Submit form method will return to add modify page if the data is entered correctly so only headers need to be checked
                assert.equal(res.headers.location, '/incomingModify');
                done();
            }
        });
    });
    it ('The product should be modified with the quantity decreasing', function(done){
        const ID = '97' 
        const Quantity = '2'
        const username = 'testuser'
        test(index)
        .post('/OutgoingModify')
        .send({ID, Quantity, username})
        .end((err, res) => {
            if (err) {
                console.error(err);
                done(err);
            } else {
                //Submit form method will return to add modify page if the data is entered correctly so only headers need to be checked
                assert.equal(res.headers.location, '/orderInput');
                done();
            }
        });
    });
});