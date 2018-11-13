'use strict';

const carwings = require('../release');
const secrets = require('./secrets.json');

const client = new carwings.Client();

// Login using a user's Carwings (i.e. Nissan Connect) credentials...
client.login(secrets.email, secrets.password, (err, vehicle) => {
    if (err) {
        console.error(err);

        return err;
    }

    // Print the vehicle VIN
    console.log(vehicle);

    // Request live status about the vehicle...
    client.requestStatus(vehicle.vin, (err, statusResponse) => {
        if (err) {
            console.error(err);

            return err;
        }

        // Print the live status
        console.log(statusResponse);
    });
});
