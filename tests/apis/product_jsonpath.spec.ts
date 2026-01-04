import {test,expect} from '@playwright/test';
import { JSONPath } from 'jsonpath-plus';

const BASE_URL = 'https://fakestoreapi.com/products';
const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

test('GET - All the Products test', async ({request}) => {
    const response = await request.get(`${BASE_URL}`, { headers });
    expect(response.status()).toBe(200);
    const data = await response.json();
    console.log('Product Details:', data);

    // Extract all product titles using JSONPath
    const titles = JSONPath({path: '$[*].title', json: data});
    console.log('Product Titles:', titles);
    expect(titles.length).toBeGreaterThan(0);

    console.log("=======================");

    //all the Ids
    const ids = JSONPath({path: '$[*].id', json: data});
    console.log('Product Ids:', ids);

     console.log("=======================");

     //all the rates
    const rates = JSONPath({path: '$[*].rating.rate', json: data}); 
    console.log('Product Rates:', rates);


    console.log("=======================");
    
    //get all the product titles where category is "jewelery"
    const jeweleryTitles = JSONPath({path: '$[?(@.category=="jewelery")].title', json: data});
    console.log('Jewelery Product Titles:', jeweleryTitles);


    //

});

