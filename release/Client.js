"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Api_1 = require("./Api");
class Client {
    constructor(regionCode, locale) {
        this._regionCode = regionCode || 'NNA'; // Default to North America
        this._locale = locale || 'en-US'; // Default to English (US)
    }
    login(userId, password, callback) {
        const that = this;
        this.connect((connectErr, passwordEncryptionKey) => {
            if (connectErr) {
                return callback(connectErr);
            }
            Api_1.Api.login(that._regionCode, that._locale, userId, password, passwordEncryptionKey, (err, response) => {
                if (err) {
                    return callback(err);
                }
                that._customSessionId = Client.extractCustomSessionIdFromLoginResponse(response);
                const customerInfo = Client.extractCustomerInfo(response);
                that._timeZone = customerInfo.timeZone;
                const vehicleInfo = Client.extractVehicleInfo(response);
                that._dcmId = vehicleInfo.dcmId;
                that._gdcUserId = vehicleInfo.gdcUserId;
                callback(undefined, {
                    vin: vehicleInfo.vin
                });
            });
        });
    }
    requestStatus(vin, callback) {
        const that = this;
        Api_1.Api.requestStatus(that._regionCode, that._locale, that._customSessionId, that._dcmId, that._gdcUserId, vin, that._timeZone, (err, response) => {
            if (err) {
                return callback(err);
            }
            const resultKey = response.resultKey;
            if (!resultKey) {
                return callback(new Error('Response did not include response key.'));
            }
            const onTimer = () => {
                Api_1.Api.requestStatusResult(that._regionCode, that._locale, that._customSessionId, that._dcmId, vin, that._timeZone, resultKey, (resultErr, resultResponse) => {
                    if (resultErr) {
                        return callback(resultErr);
                    }
                    const responseFlag = resultResponse.responseFlag;
                    if (!responseFlag) {
                        return callback(new Error('Response did not include response flag.'));
                    }
                    if (responseFlag === '0') {
                        setTimeout(onTimer, Client.RESULT_POLLING_INTERVAL);
                    }
                    else {
                        callback(undefined, resultResponse);
                    }
                });
            };
            setTimeout(onTimer, Client.RESULT_POLLING_INTERVAL);
        });
    }
    requestHvacOn(vin, callback) {
        const that = this;
        Api_1.Api.requestHvacOn(that._regionCode, that._customSessionId, vin, (err, response) => {
            if (err) {
                return callback(err);
            }
            else {
                callback(undefined, response);
            }
        });
    }
    requestHvacOff(vin, callback) {
        const that = this;
        Api_1.Api.requestHvacOff(that._regionCode, that._customSessionId, vin, (err, response) => {
            if (err) {
                return callback(err);
            }
            else {
                callback(undefined, response);
            }
        });
    }
    connect(callback) {
        Api_1.Api.connect(this._regionCode, this._locale, (err, response) => {
            if (err) {
                return callback(err);
            }
            const passwordEncryptionKey = response.baseprm;
            if (!passwordEncryptionKey) {
                return callback(new Error('Response did not include password encryption key.'));
            }
            return callback(undefined, passwordEncryptionKey);
        });
    }
    static extractCustomSessionIdFromLoginResponse(response) {
        const vehicleInfoList = response.VehicleInfoList;
        if (!vehicleInfoList) {
            console.warn('Response did not include a vehicle information list.');
            return;
        }
        ;
        const vehicleInfo = vehicleInfoList.vehicleInfo;
        if (!vehicleInfo) {
            console.warn('Response did not include vehicle information.');
            return;
        }
        if (!(vehicleInfo instanceof Array)) {
            console.warn('Vehicle information property is not an array.');
            return;
        }
        if (vehicleInfo.length === 0) {
            console.warn('Response did not include a vehicle.');
            return;
        }
        if (vehicleInfo.length > 1) {
            console.warn('Response included more than one vehicle.');
        }
        const vehicle = vehicleInfo[0];
        const customSessionId = vehicle.custom_sessionid;
        if (!customSessionId) {
            console.warn('Response did not include a custom session ID.');
        }
        return customSessionId;
    }
    static extractCustomerInfo(response) {
        const customerInfo = response.CustomerInfo;
        if (!customerInfo) {
            console.warn('Response did not include a customer info object.');
            return;
        }
        const timeZone = customerInfo.Timezone;
        if (!timeZone) {
            console.warn('Response did not include a timezone.');
        }
        return {
            timeZone: timeZone
        };
    }
    static extractVehicleInfo(response) {
        const vehicle = response.vehicle;
        if (!vehicle) {
            console.warn('Response did not include a vehicle object.');
            return;
        }
        const profile = vehicle.profile;
        if (!profile) {
            console.warn('Response did not include a profile.');
            return;
        }
        const gdcUserId = profile.gdcUserId;
        if (!gdcUserId) {
            console.warn('Response did not include a GDC user ID.');
        }
        const dcmId = profile.dcmId;
        if (!dcmId) {
            console.warn('Response did not include a DCM ID.');
        }
        const vin = profile.vin;
        if (!vin) {
            console.warn('Response did not include a VIN.');
        }
        return {
            gdcUserId: gdcUserId,
            dcmId: dcmId,
            vin: vin
        };
    }
}
Client.RESULT_POLLING_INTERVAL = 20000;
exports.Client = Client;
//# sourceMappingURL=Client.js.map