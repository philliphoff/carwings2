import * as crypto from 'crypto';
import * as request from 'request';

export class Api {
    private static NNA_BASE_ENDPOINT = 'https://gdcportalgw.its-mo.com/gworchest_160803EC/gdc';
    private static NE_BASE_ENDPOINT = 'https://gdcportalgw.its-mo.com/api_v181217_NE/gdc';
    private static INITIAL_APP_STRINGS = 'geORNtsZe5I4lRGjG9GZiA';

    private static getBaseEndpoint(regionCode: string) {
        return (regionCode === 'NNA' ? Api.NNA_BASE_ENDPOINT : Api.NE_BASE_ENDPOINT);
    }

    public static connect(
        regionCode: string,
        locale: string,
        callback: (err?: Error, response?) => void): void {
        request.post({
            url: Api.getBaseEndpoint(regionCode) + '/InitialApp.php',
            form: {
                'initial_app_strings': Api.INITIAL_APP_STRINGS,
                'RegionCode': regionCode,
                'lg': locale
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

            return callback(undefined, parsedBody);
        });
    }

    public static login(
        regionCode: string,
        locale: string,
        userId: string,
        password: string,
        passwordEncryptionKey: string,
        callback: (err?: Error, response?) => void): void {

        const encryptedPassword = Api.encryptPassword(password, passwordEncryptionKey);

        request.post({
            url: Api.getBaseEndpoint(regionCode) + '/UserLoginRequest.php',
            form: {
                'initial_app_strings': Api.INITIAL_APP_STRINGS,
                'RegionCode': regionCode,
                'lg': locale,
                'UserId': userId,
                'Password': encryptedPassword
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

            callback(undefined, parsedBody);
        });
    }

    public static requestStatus(
        regionCode: string,
        locale: string,
        customSessionId: string,
        dcmId: string,
        gdcUserId: string,
        vin: string,
        timeZone: string,
        callback: (err?: Error, response?) => void): void {
        request.post({
            url: Api.getBaseEndpoint(regionCode) + '/BatteryStatusCheckRequest.php',
            form: {
                'initial_app_strings': Api.INITIAL_APP_STRINGS,
                'RegionCode': regionCode,
                'lg': locale,
                'custom_sessionid': customSessionId,
                'DCMID': dcmId,
                'UserId': gdcUserId,
                'VIN': vin,
                'tz': timeZone
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

            callback(undefined, parsedBody);
        });
    }

    public static requestStatusResult(
        regionCode: string,
        locale: string,
        customSessionId: string,
        dcmId: string,
        vin: string,
        timeZone: string,
        resultKey: string,
        callback: (err?: Error, response?) => void): void {
        request.post({
            url: Api.getBaseEndpoint(regionCode) + '/BatteryStatusCheckResultRequest.php',
            form: {
                'initial_app_strings': Api.INITIAL_APP_STRINGS,
                'RegionCode': regionCode,
                'lg': locale,
                'custom_sessionid': customSessionId,
                'DCMID': dcmId,
                'VIN': vin,
                'tz': timeZone,
                'resultKey': resultKey
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

            callback(undefined, parsedBody);
        });
    }

    public static requestCachedStatus(
        regionCode: string,
        locale: string,
        customSessionId: string,
        dcmId: string,
        gdcUserId: string,
        vin: string,
        timeZone: string,
        callback: (err?: Error, response?) => void): void {
        request.post({
            url: Api.getBaseEndpoint(regionCode) + '/BatteryStatusRecordsRequest.php',
            form: {
                'initial_app_strings': Api.INITIAL_APP_STRINGS,
                'RegionCode': regionCode,
                'lg': locale,
                'custom_sessionid': customSessionId,
                'DCMID': dcmId,
                'UserId': gdcUserId,
                'VIN': vin,
                'tz': timeZone
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

            callback(undefined, parsedBody);
        });
    }

    public static requestClimateControlStatus(
        regionCode: string,
        locale: string,
        customSessionId: string,
        dcmId: string,
        gdcUserId: string,
        vin: string,
        timeZone: string,
        callback: (err?: Error, response?) => void): void {
        request.post({
            url: Api.getBaseEndpoint(regionCode) + '/RemoteACRecordsRequest.php',
            form: {
                'initial_app_strings': Api.INITIAL_APP_STRINGS,
                'RegionCode': regionCode,
                'lg': locale,
                'custom_sessionid': customSessionId,
                'DCMID': dcmId,
                'UserId': gdcUserId,
                'VIN': vin,
                'tz': timeZone
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

            callback(undefined, parsedBody);
        });
    }

    public static requestClimateControlTurnOn(
        regionCode: string,
        locale: string,
        customSessionId: string,
        dcmId: string,
        gdcUserId: string,
        vin: string,
        timeZone: string,
        callback: (err?: Error, response?) => void): void {
        request.post({
            url: Api.getBaseEndpoint(regionCode) + '/ACRemoteRequest.php',
            form: {
                'initial_app_strings': Api.INITIAL_APP_STRINGS,
                'RegionCode': regionCode,
                'lg': locale,
                'custom_sessionid': customSessionId,
                'DCMID': dcmId,
                'UserId': gdcUserId,
                'VIN': vin,
                'tz': timeZone
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

            callback(undefined, parsedBody);
        });
    }

    public static requestClimateControlTurnOnResult(
        regionCode: string,
        locale: string,
        customSessionId: string,
        dcmId: string,
        vin: string,
        timeZone: string,
        resultKey: string,
        callback: (err?: Error, response?) => void): void {
        request.post({
            url: Api.getBaseEndpoint(regionCode) + '/ACRemoteResult.php',
            form: {
                'initial_app_strings': Api.INITIAL_APP_STRINGS,
                'RegionCode': regionCode,
                'lg': locale,
                'custom_sessionid': customSessionId,
                'DCMID': dcmId,
                'VIN': vin,
                'tz': timeZone,
                'resultKey': resultKey
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

            callback(undefined, parsedBody);
        });
    }

    public static requestClimateControlTurnOff(
        regionCode: string,
        locale: string,
        customSessionId: string,
        dcmId: string,
        gdcUserId: string,
        vin: string,
        timeZone: string,
        callback: (err?: Error, response?) => void): void {
        request.post({
            url: Api.getBaseEndpoint(regionCode) + '/ACRemoteOffRequest.php',
            form: {
                'initial_app_strings': Api.INITIAL_APP_STRINGS,
                'RegionCode': regionCode,
                'lg': locale,
                'custom_sessionid': customSessionId,
                'DCMID': dcmId,
                'UserId': gdcUserId,
                'VIN': vin,
                'tz': timeZone
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

            callback(undefined, parsedBody);
        });
    }

    public static requestClimateControlTurnOffResult(
        regionCode: string,
        locale: string,
        customSessionId: string,
        dcmId: string,
        vin: string,
        timeZone: string,
        resultKey: string,
        callback: (err?: Error, response?) => void): void {
        request.post({
            url: Api.getBaseEndpoint(regionCode) + '/ACRemoteOffResult.php',
            form: {
                'initial_app_strings': Api.INITIAL_APP_STRINGS,
                'RegionCode': regionCode,
                'lg': locale,
                'custom_sessionid': customSessionId,
                'DCMID': dcmId,
                'VIN': vin,
                'tz': timeZone,
                'resultKey': resultKey
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

            callback(undefined, parsedBody);
        });
    }

    public static requestChargingStart(
        regionCode: string,
        locale: string,
        customSessionId: string,
        dcmId: string,
        gdcUserId: string,
        vin: string,
        timeZone: string,
        callback: (err?: Error, response?) => void): void {
        request.post({
            url: Api.getBaseEndpoint(regionCode) + '/BatteryRemoteChargingRequest.php',
            form: {
                'initial_app_strings': Api.INITIAL_APP_STRINGS,
                'RegionCode': regionCode,
                'lg': locale,
                'custom_sessionid': customSessionId,
                'DCMID': dcmId,
                'UserId': gdcUserId,
                'VIN': vin,
                'tz': timeZone
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

            callback(undefined, parsedBody);
        });
    }

    private static encryptPassword(password: string, passwordEncryptionKey: string) {
        const cipher = crypto.createCipheriv('bf-ecb', new Buffer(passwordEncryptionKey), new Buffer(''));

        let encrypted = cipher.update(password, 'utf8', 'base64');

        encrypted += cipher.final('base64');

        return encrypted;
    }
}
