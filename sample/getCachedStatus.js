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

    client.getCachedStatus(vehicle.vin, (cachedStatusErr, cachedStatusResponse) => {
        if (typeof cachedStatusErr !== "undefined") console.log(cachedStatusErr);

        // Print the cached vehicle status
        console.log(cachedStatusResponse);
    });
});
