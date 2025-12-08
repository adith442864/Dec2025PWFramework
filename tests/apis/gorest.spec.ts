import {test,expect, request} from '@playwright/test';

const TOKEN = 'ef2b6f303c5e1588c87981610a92fb057e7ffd6d868681a5bd9df50f2d1ea239';

test('GET - fetch all users', async ({request}) => {
    const response = await request.get('https://gorest.co.in/public/v2/users', {
        headers: {
            Authorization: `Bearer ${TOKEN}`,
        }
    });
    expect(response.status()).toBe(200);
    const data = await response.json();
    console.log(data);
    expect(response.ok()).toBeTruthy();
});

test('GET - single user', async ({request}) => {
    const response = await request.get('https://gorest.co.in/public/v2/users/8278256', {
        headers: {
            Authorization: `Bearer ${TOKEN}`,
        }
    });
    expect(response.status()).toBe(200);
    const data = await response.json();
    console.log(data);
    expect(response.ok()).toBeTruthy();
});

test('POST - create new user', async ({request}) => {

    const requestBody = {
        'name': 'PW USER12',
        'email': `pwtest${Date.now()}.@mail.com`,
        'gender': 'male',
        'status': 'active'
        };
    const response = await request.post('https://gorest.co.in/public/v2/users', {
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: requestBody
    });
    expect(response.status()).toBe(201);
    const data = await response.json();
    console.log(data);
}); 



test('PUT - update new user', async ({request}) => {

    const requestBody = {
        'gender': 'female',
        'status': 'inactive'
        };
    const response = await request.put('https://gorest.co.in/public/v2/users/8278242', {
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: requestBody
    });
    expect(response.status()).toBe(201);
    const data = await response.json();
    console.log(data);
}); 


