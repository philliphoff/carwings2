import * as crypto from 'crypto';
import * as request from 'request';

export class Client {
    private static BASE_ENDPOINT = 'https://gdcportalgw.its-mo.com/gworchest_0307C/gdc';

    /* tslint:disable no-any */
    public static connect(callback: (err?: Error, response?: any) => void) {
    /* tslint:enable no-any */
        request.post({
            url: Client.BASE_ENDPOINT + '/InitialApp.php',
            form: {
                'RegionCode': 'NNA',
                'lg': 'en-US',
                'initial_app_strings': 'geORNtsZe5I4lRGjG9GZiA',
                'custom_sessionid': ''
            }
        },
        (err, response, body) => {
            if (err) {
                return callback(err);
            }

            const parsedResponse = JSON.parse(body);

            callback(undefined, parsedResponse);
        });
    }

    public static login(userId: string, password: string, callback: (err?: Error) => void) {
        Client.connect(
            (connectErr, connectResponse) => {
                const cipher = crypto.createCipheriv('bf-ecb', new Buffer(connectResponse.baseprm), new Buffer(''));

                let encrypted = cipher.update(password, 'utf8', 'base64');
                encrypted += cipher.final('base64');

                request.post({
                    url: Client.BASE_ENDPOINT + '/UserLoginRequest.php',
                    form: {
                        'RegionCode': 'NNA',
                        'lg': 'en-US',
                        'UserId': userId,
                        'Password': encrypted,
                        'initial_app_strings': 'geORNtsZe5I4lRGjG9GZiA'
                    }
                },
                (err, response, body) => {
                    if (err) {
                        return callback(err);
                    }

                    callback(undefined);
                });
            });
    }
}
