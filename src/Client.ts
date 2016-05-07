import * as crypto from 'crypto';
import * as request from 'request';

export class Client {
    private static BASE_ENDPOINT = 'https://gdcportalgw.its-mo.com/gworchest_0307C/gdc';
    private static INITIAL_APP_STRINGS = 'geORNtsZe5I4lRGjG9GZiA';

    private _customSessionId: string;
    private _regionCode: string;
    private _locale: string;

    public constructor(regionCode?: string, locale?: string) {
        this._regionCode = regionCode || 'NNA'; // Default to North America
        this._locale = locale || 'en-US';       // Default to English (US)
    }

    public connect(callback: (err?: Error, passwordEncryptionKey?: string) => void): void {
        request.post({
            url: Client.BASE_ENDPOINT + '/InitialApp.php',
            form: {
                'RegionCode': this._regionCode,
                'lg': this._locale,
                'initial_app_strings': Client.INITIAL_APP_STRINGS
            }
        },
        (err, response, body) => {
            if (err) {
                return callback(err);
            }

            if (response.statusCode !== 200) {
                return callback(new Error('Response was status code: ' + response.statusCode + ' (' + response.statusMessage + ')'));
            }

            const parsedBody = JSON.parse(body);
            const passwordEncryptionKey = parsedBody.baseprm;

            if (!passwordEncryptionKey) {
                return callback(new Error('Response did not include password encryption key.'));
            }

            return callback(undefined, passwordEncryptionKey);
        });
    }

    public login(userId: string, password: string, callback: (err?: Error, vehicle?: Object) => void): void {
        const that = this;

        this.connect(
            (connectErr, passwordEncryptionKey) => {
                if (connectErr) {
                    return callback(connectErr);
                }

                const encryptedPassword = Client.encryptPassword(password, passwordEncryptionKey);

                request.post({
                    url: Client.BASE_ENDPOINT + '/UserLoginRequest.php',
                    form: {
                        'RegionCode': that._regionCode,
                        'lg': that._locale,
                        'UserId': userId,
                        'Password': encryptedPassword,
                        'initial_app_strings': Client.INITIAL_APP_STRINGS
                    }
                },
                (err, response, body) => {
                    if (err) {
                        return callback(err);
                    }

                    if (response.statusCode !== 200) {
                        return callback(new Error('Response was status code: ' + response.statusCode + ' (' + response.statusMessage + ')'));
                    }

                    const parsedBody = JSON.parse(body);

                    that._customSessionId = Client.extractCustomSessionIdFromLoginResponse(parsedBody);

                    callback(undefined, parsedBody);
                });
            });
    }

    private static encryptPassword(password: string, passwordEncryptionKey: string) {
        const cipher = crypto.createCipheriv('bf-ecb', new Buffer(passwordEncryptionKey), new Buffer(''));

        let encrypted = cipher.update(password, 'utf8', 'base64');

        encrypted += cipher.final('base64');

        return encrypted;
    }

    private static extractCustomSessionIdFromLoginResponse(response): string {
        const vehicleInfoList = response.VehicleInfoList;

        if (!vehicleInfoList) {
            console.warn('Response did not include a vehicle information list.');
            return;
        };

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
            console.warn('Response did not include ag vehicle.');
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
}
