var carwings = require('carwings2-mrw');
var fs = require("fs");
const secrets = JSON.parse(fs.readFileSync(require('os').homedir() + "/nissan-leaf-secrets.json"));

// Create an instance of the client...
var client = new carwings.Client("NE");

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
