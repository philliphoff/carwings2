'use strict';

const carwings = require('../release');
const secrets = require('./secrets.json');

carwings.Client.login(secrets.email, secrets.password, err => {
    if (err) {
        console.error(err);
        
        return err;
    }
    
    console.log('Connected!');
});
