import {test,expect, request} from '@playwright/test';

const TOKEN = 'ef2b6f303c5e1588c87981610a92fb057e7ffd6d868681a5bd9df50f2d1ea239';
const BASE_URL = 'https://gorest.co.in/public/v2/users';

//Common headers for all requests
const headers = {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
    'Accept':'application/json'
};

test('GET - fetch all users', async ({request}) => {
    const response = await request.get(BASE_URL,{headers: headers});
    expect(response.status()).toBe(200);
    const data = await response.json();
    console.log(data);
    expect(response.ok()).toBeTruthy();
});

test('POST - create a new user', async ({request}) => {
    const requestBody = {
        'name': 'PW USER12',
        'email': `pwtest${Date.now()}.@mail.com`,
        'gender': 'male',
        'status': 'active'
        };
    const response = await request.post(BASE_URL,
        {headers: headers, 
        data: requestBody
    });
    expect(response.status()).toBe(201);
    const data = await response.json();
    console.log(data);
    
});


test('PUT - update a user', async ({request}) => {

    const userId = 8278244; // Specify the user ID to update

    const requestBody = {
        'status': 'inactive'
        };
        //https://gorest.co.in/public/v2/users/8278244
    const response = await request.put(`${BASE_URL}/${userId}`,
        {headers: headers, 
        data: requestBody
    });
    expect(response.status()).toBe(200);
    const data = await response.json();
    console.log(data);
    
});

test('DELETE - delete a user', async ({request}) => {

    const userId = 8278244; // Specify the user ID to update

    //https://gorest.co.in/public/v2/users/8278244
    const response = await request.delete(`${BASE_URL}/${userId}`,
        {
            headers: headers, 
        });
    expect(response.status()).toBe(204);
    console.log(`User with ID ${userId} deleted successfully.`);
    
    
});



