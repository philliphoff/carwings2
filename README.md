# carwings2 (MRW Edited Fork - Works for EU cars)
A Node.js client library for the Nissan Leaf "Carwings" API.

This library makes use of version "2" of the Carwings API.

## Installation

```bash
> npm install carwings2 --save
```

## Use

```javascript
var carwings = require('carwings2');

var secrets = {
    email: <email>,
    password: <password>
};

// Create an instance of the client...
var client = new carwings.Client();

// Login using a user's Carwings (i.e. Nissan Connect) credentials...
client.login(secrets.email, secrets.password, (err, vehicle) => {
    if (err) {
        console.error(err);
        
        return err;
    }
    
    //
    // Logging in returns information about the user's vehicle, including its VIN.
    //
    
    // Request status about the user's vehicle...
    client.requestStatus(vehicle.vin, (statusErr, statusResponse) => {
        if (statusErr) {
            console.error(statusErr);
            
            return statusErr;
        }
        
        //
        // The response contains (raw) properties related to the status of the vehicle (e.g. charging or not).
        //
        
        console.log(statusResponse);
    });
});

```

## API

### Client

> Client(regionCode, locale)

 - `regionCode` *(string, optional)*: The region in which the user resides. Defaults to `'NNA'` (United States).
 - `locale` *(string, optional)*: The locale (language) of the user. Defaults to `'en-US'` (English (United States)).
 
> login(email, password, callback)

 - `email` *(string)*: The email address associated with the user's Carwings account.
 - `password` *(string)*: The password associated with the user's Carwings account.
 - `callback` *(function)*: Invoked on completion of the request.
 
> requestStatus(vin, callback)

 - `vin` *(string)*: The VIN of the user's vehicle (e.g. provided to the `login()` callback).
 - `callback` *(function)*: Invoked on completion of the request.

Note: This call can take upwards of several minutes to complete.

## Acknowledgements

This library was inspired by [Jason Horne's](https://github.com/jdhorne) [`pywings2`](https://github.com/jdhorne/pycarwings2) Carwings library for Python.

## License

MIT
