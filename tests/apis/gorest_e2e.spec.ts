import {test,expect, request} from '@playwright/test';

const TOKEN = 'ef2b6f303c5e1588c87981610a92fb057e7ffd6d868681a5bd9df50f2d1ea239';
const BASE_URL = 'https://gorest.co.in/public/v2/users';

//Common headers for all requests
const headers = {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
    'Accept':'application/json'
};

test('e2e api test - create, update, delete user', async ({request}) => {

    console.log('---------POST CALL----------');
    // Step 1: Create a new user
    const requestBody = {
        'name': 'PW USER12',
        'email': `pwtest${Date.now()}.@mail.com`,
        'gender': 'male',
        'status': 'active'
        };

    const responsePOST = await request.post(BASE_URL,
        {headers: headers, 
        data: requestBody
        });
        expect(responsePOST.status()).toBe(201);
        const createdUser = await responsePOST.json();
        console.log(createdUser);
        const userId = createdUser.id;
        console.log('User created:', userId);

        console.log('---------GET CALL----------');

        //step 2: Get the same user by using same user id 
        const responseGET = await request.get(BASE_URL+'/'+userId, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                }
            });
            expect(responseGET.status()).toBe(200);
            expect((await responseGET.json()).id).toBe(userId);
            const data = await responseGET.json();
            console.log(data);

        //step 3: Update the user
        console.log('---------PUT CALL----------');
        const updateRequestBody = {
            'name': 'PW Test Automation User',
            'status': 'inactive'
            };
        const responsePUT = await request.put(`${BASE_URL}/${userId}`,
            {headers: headers, 
            data: updateRequestBody
        });
        expect(responsePUT.status()).toBe(200);
        const updatedData = await responsePUT.json();
        console.log(updatedData);

        //step 4: Delete the user
        console.log('---------DELETE CALL----------');

        const responseDELETE = await request.delete(`${BASE_URL}/${userId}`,
            {headers: headers
        });
        expect(responseDELETE.status()).toBe(204);
        console.log(`User with ID ${userId} deleted successfully.`);

        //step 5: Try to get the deleted user - negative test
        console.log('---------GET CALL for deleted user----------');

        const responseGETDeleted = await request.get(BASE_URL+'/'+userId, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                }
            });
            expect(responseGETDeleted.status()).toBe(404);
            const deletedData = await responseGETDeleted.json();
            console.log(deletedData);
            console.log(`User with ID ${userId} not found as expected after deletion.`);

});