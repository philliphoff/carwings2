'use strict';

console.log("Starting app");

const carwings = require('../release');

const client = new carwings.Client();

client.login("sean@thefergies.net", "Nermal01", (err, vehicle) => {
    if (err) {
        console.error(err);

        return err;
    }
    else {
        console.log("All done");
    }
    //console.log("Requesting HVAC off");

    /*client.requestHvacOff(vehicle.vin, (statusErr, statusResponse) => {
        if (statusErr) {
            console.error(statusErr);

            return statusErr;
        }

        console.log(statusResponse);
    });*/

    
    client.requestStatus(vehicle.vin, (statusErr, statusResponse) => {
        if (statusErr) {
            console.error(statusErr);

            return statusErr;
        }

        console.log(statusResponse);
    });
});
