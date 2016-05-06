import * as request from 'request';

export class Client {
    private static BASE_ENDPOINT = 'https://gdcportalgw.its-mo.com/gworchest_0307C/gdc';

    public static connect(callback: (err?: Error) => void) {
        request({
            url: Client.BASE_ENDPOINT + '/InitialApp.php',
            formData: {
                'RegionCode': 'NNA',
                'lg': 'en-US',
                'initial_app_strings': 'geORNtsZe5I4lRGjG9GZiA',
                'custom_sessionid': ''
            }
        },
        (err, response, body) => {
            callback(err);
        });
    }
}
