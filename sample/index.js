'use strict';

const carwings = require('../release');
const secrets = require('./secrets.json');

const client = new carwings.Client();

client.login(secrets.email, secrets.password, (err, vehicle) => {
    if (err) {
        console.error(err);
        
        return err;
    }
    
    client.requestStatus(vehicle.vin, (statusErr, statusResponse) => {
        if (statusErr) {
            console.error(statusErr);
            
            return statusErr;
        }
        
        console.log(response);
    });
});
