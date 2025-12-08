import {test,expect} from '@playwright/test';
import { log } from 'console';
import { json } from 'stream/consumers';
import { CLIENT_RENEG_LIMIT } from 'tls';


const CLIENT_ID = 'f846f7b317064d0cbf5fdc4269356036';
const CLIENT_SECRET = '35c9cfcb7fd940158b23e081ac4cd759';
let accessToken : string;

test.beforeEach(async ({request}) => {
    console.log('Starting Spotify OAuth2 API tests...');
    const response = await request.post('https://accounts.spotify.com/api/token', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
        },
        form: {
            grant_type: 'client_credentials',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET
        }
    });
    expect(response.status()).toBe(200);
    const data = await response.json();
    accessToken = data.access_token;
    console.log('Obtained Access Token==>:', accessToken);
});

test('GET - fetch new releases', async ({request}) => {
    const response = await request.get('https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }
    });
    expect(response.status()).toBe(200);
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));

});