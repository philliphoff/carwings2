'use strict';

const carwings = require('../release');

carwings.Client.connect(err => {
    if (err) {
        console.error(err);
        
        return err;
    }
    
    console.log('Connected!');
});
