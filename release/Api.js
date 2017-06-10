"use strict";
/// <reference path="../typings/index.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const request = require("request");
class Api {
    static connect(regionCode, locale, callback) {
        request.post({
            url: Api.BASE_ENDPOINT + '/InitialApp.php',
            form: {
                'initial_app_strings': Api.INITIAL_APP_STRINGS,
                'RegionCode': regionCode,
                'lg': locale
            }
        }, (err, response, body) => {
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
    static login(regionCode, locale, userId, password, passwordEncryptionKey, callback) {
        const encryptedPassword = Api.encryptPassword(password, passwordEncryptionKey);
        request.post({
            url: Api.BASE_ENDPOINT + '/UserLoginRequest.php',
            form: {
                'initial_app_strings': Api.INITIAL_APP_STRINGS,
                'RegionCode': regionCode,
                'lg': locale,
                'UserId': userId,
                'Password': encryptedPassword
            }
        }, (err, response, body) => {
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
    static requestStatus(regionCode, locale, customSessionId, dcmId, gdcUserId, vin, timeZone, callback) {
        request.post({
            url: Api.BASE_ENDPOINT + '/BatteryStatusCheckRequest.php',
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
        }, (err, response, body) => {
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
    static requestStatusResult(regionCode, locale, customSessionId, dcmId, vin, timeZone, resultKey, callback) {
        request.post({
            url: Api.BASE_ENDPOINT + '/BatteryStatusCheckResultRequest.php',
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
        }, (err, response, body) => {
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
    static requestHvacOn(regionCode, customSessionId, vin, callback) {
        request.post({
            url: Api.BASE_ENDPOINT + '/ACRemoteRequest.php',
            form: {
                'RegionCode': regionCode,
                'VIN': vin,
                'custom_sessionid': customSessionId
            }
        }, (err, response, body) => {
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
    static requestHvacOff(regionCode, customSessionId, vin, callback) {
        request.post({
            url: Api.BASE_ENDPOINT + '/ACRemoteOffRequest.php',
            form: {
                'RegionCode': regionCode,
                'VIN': vin,
                'custom_sessionid': customSessionId
            }
        }, (err, response, body) => {
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
    static encryptPassword(password, passwordEncryptionKey) {
        const cipher = crypto.createCipheriv('bf-ecb', new Buffer(passwordEncryptionKey), new Buffer(''));
        let encrypted = cipher.update(password, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;
    }
}
Api.BASE_ENDPOINT = 'https://gdcportalgw.its-mo.com/gworchest_160803EC/gdc';
Api.INITIAL_APP_STRINGS = 'geORNtsZe5I4lRGjG9GZiA';
exports.Api = Api;
//# sourceMappingURL=Api.js.map