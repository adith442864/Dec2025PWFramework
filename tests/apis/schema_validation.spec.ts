import {test,expect} from '@playwright/test';
import Ajv from 'ajv';
import fs from 'fs';
import path from 'path/win32';

const TOKEN = 'ef2b6f303c5e1588c87981610a92fb057e7ffd6d868681a5bd9df50f2d1ea239';

//setup AJV instance
const ajv = new Ajv();

//load the schema file
const getUsersSchema = JSON.parse(fs.readFileSync(path.resolve('./schemas/getusersschema.json'), 'utf-8'));


test('GET - fetch all users', async ({request}) => {
    const response = await request.get('https://gorest.co.in/public/v2/users', {
        headers: {
            Authorization: `Bearer ${TOKEN}`,
        }
    });
    expect(response.status()).toBe(200);
    const data = await response.json();
    console.log(data);
   //validate the jscon schema:
    const validate = ajv.compile(getUsersSchema);
    const valid = validate(data);
   
    if(!valid){
    console.log(validate.errors);
   }
    expect(valid).toBe(true);
    
});