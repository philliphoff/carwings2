var carwings = require('carwings2-mrw');
var fs = require("fs");
const secrets = JSON.parse(fs.readFileSync(require('os').homedir() + "/nissan-leaf-secrets.json"));

// Create an instance of the client for a European car
var client = new carwings.Client("NE");

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
