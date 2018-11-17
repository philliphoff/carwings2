'use strict';

const carwings = require('../release');
const secrets = require('./secrets.json');

const client = new carwings.Client();

// Login
client.login(secrets.email, secrets.password, (err, vehicle) => {
    if (err) {
        console.error(err);

        return err;
    }

    // Print the vehicle VIN
    console.log(vehicle);

    // Send the car a command to start charging
    client.requestChargingStart(vehicle.vin, (err, satusResponse) => {
        if (typeof err !== "undefined") console.log(err);
        console.log(statusResponse);
    });
});
