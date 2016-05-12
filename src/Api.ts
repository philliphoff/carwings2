//import * as crypto from 'crypto';
import * as request from 'request';

export class Api {
    private static BASE_ENDPOINT = 'https://gdcportalgw.its-mo.com/gworchest_0307C/gdc';
    private static INITIAL_APP_STRINGS = 'geORNtsZe5I4lRGjG9GZiA';

    public static connect(
        regionCode: string,
        locale: string,
        callback: (err?: Error, response?) => void): void {
        request.post({
            url: Api.BASE_ENDPOINT + '/InitialApp.php',
            form: {
                'RegionCode': regionCode,
                'lg': locale,
                'initial_app_strings': Api.INITIAL_APP_STRINGS
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
}
