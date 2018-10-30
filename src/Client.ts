import { Api } from './Api';
import { IVehicle } from './IVehicle';

export class Client {
    private static RESULT_POLLING_INTERVAL = 20000;

    private _customSessionId: string;
    private _dcmId: string;
    private _gdcUserId: string;
    private _locale: string;
    private _regionCode: string;
    private _timeZone: string;

    constructor(regionCode?: string, locale?: string) {
        this._regionCode = regionCode || 'NE';
        this._locale = locale || 'en-US';       // Default to English (US)
    }

    public login(userId: string, password: string, callback: (err?: Error, vehicle?: IVehicle) => void): void {
        const that = this;

        this.connect(
            (connectErr, passwordEncryptionKey) => {
                if (connectErr) {
                    return callback(connectErr);
                }

                Api.login(
                    that._regionCode,
                    that._locale,
                    userId,
                    password,
                    passwordEncryptionKey,
                    (err, response) => {
                        if (err) {
                            return callback(err);
                        }

                        that._customSessionId = Client.extractCustomSessionIdFromLoginResponse(response);

                        const customerInfo = Client.extractCustomerInfo(response);

                        that._timeZone = customerInfo.timeZone;

                        const vehicleInfo = Client.extractVehicleInfo(response);

                        that._dcmId = vehicleInfo.dcmId;
                        that._gdcUserId = vehicleInfo.gdcUserId;

                        callback(
                            undefined,
                            {
                                vin: vehicleInfo.vin
                        });
                    });
            });
    }

    public requestStatus(vin: string, callback: (err?: Error, status?) => void): void {
        const that = this;

        Api.requestStatus(
            that._regionCode,
            that._locale,
            that._customSessionId,
            that._dcmId,
            that._gdcUserId,
            vin,
            that._timeZone,
            (err, response) => {
                if (err) {
                    return callback(err);
                }

                const resultKey = response.resultKey;

                if (!resultKey) {
                    return callback(new Error('Response did not include response key.'));
                }

                const onTimer = () => {
                    Api.requestStatusResult(
                        that._regionCode,
                        that._locale,
                        that._customSessionId,
                        that._dcmId,
                        vin,
                        that._timeZone,
                        resultKey,
                        (resultErr, resultResponse) => {
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

    public getClimateControl(vin: string, callback: (err?: Error, status?) => void): void {
        const that = this;

        Api.requestClimateControlStatus(
            that._regionCode,
            that._locale,
            that._customSessionId,
            that._dcmId,
            that._gdcUserId,
            vin,
            that._timeZone,
            (err, response) => {
                if (err) {
                    return callback(err);
                }
                callback(undefined, response);
            });
    }

    private connect(callback: (err?: Error, passwordEncryptionKey?: string) => void): void {
        Api.connect(
            this._regionCode,
            this._locale,
            (err, response) => {
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

    private static extractCustomSessionIdFromLoginResponse(response): string {
        const vehicleInfo = response.vehicleInfo;

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

    private static extractCustomerInfo(response): {
        timeZone: string
    }{
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

    private static extractVehicleInfo(response): {
        gdcUserId: string,
        dcmId: string,
        vin: string
    }{
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
