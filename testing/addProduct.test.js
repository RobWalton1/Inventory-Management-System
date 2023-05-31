const assert = require('assert');
const index = require('../index.js');
const test = require('supertest');

describe('Test to check if data can be uploaded', () => {
    it ('Should login with correct details', function(done){
        const productName = 'test' 
        const Description = 'test'
        const Quantity = '1'
        const Location = 'textZone'
        const Price = '1'
        test(index)
        .post('/submit-form')
        .send({productName, Description, Quantity, Location, Price})
        .end((err, res) => {
            if (err) {
                console.error(err);
                done(err);
            } else {
                //Submit form method will return to add procucts page if the data is entered correctly so only headers need to be checked
                assert.equal(res.headers.location, '/addProducts');
                done();
            }
        });
    });
});