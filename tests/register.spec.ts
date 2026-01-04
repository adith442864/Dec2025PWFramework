import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';

//schema/type of reg data fields
type RegData = {
    firstName: string,
    lastName: string,
    telephone: string,
    password: string,
    subscribeNewsletter: string
}

// Read from CSV
const fileContent = fs.readFileSync('./data/register.csv', 'utf-8');
const registerationData:RegData[]  = parse(fileContent, {
    columns: true,
    skip_empty_lines: true
});

for (const user of registerationData) {
    test(`@register CSV - verify user is able to register ${user.firstName}`, async ({ page, baseURL }) => {
    
        const loginPage = new LoginPage(page);
        await loginPage.goToLoginPage(baseURL);
        const registerPage: RegisterPage = await loginPage.navigateToRegisterPage();
        const isUserRegistered = await registerPage.registerUser(
            user.firstName,
            user.lastName,
            getRandomEmail(),
            user.telephone,
            user.password,
            user.subscribeNewsletter);
        expect(isUserRegistered).toBeTruthy();

    });
}

// Read from JSON
const jsonFileContent = fs.readFileSync('./data/register.json', 'utf-8');
const registerationDataJson:RegData[] = JSON.parse(jsonFileContent);

for (const user of registerationDataJson) {
    test(`@register JSON - verify user is able to register ${user.firstName}`, async ({ page, baseURL }) => {
    
        const loginPage = new LoginPage(page);
        await loginPage.goToLoginPage(baseURL);
        const registerPage: RegisterPage = await loginPage.navigateToRegisterPage();
        const isUserRegistered = await registerPage.registerUser(
            user.firstName,
            user.lastName,
            getRandomEmail(),
            user.telephone,
            user.password,
            user.subscribeNewsletter);
        expect(isUserRegistered).toBeTruthy();

    });
}

// Read from XLSX
const xlsxFileContent = fs.readFileSync('./data/register.xlsx');
const workbook = XLSX.read(xlsxFileContent, { type: 'buffer' });
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const registerationDataExcel:RegData[] = XLSX.utils.sheet_to_json(worksheet);

for (const user of registerationDataExcel) {
    test(`@register XLSX - verify user is able to register ${user.firstName}`, async ({ page, baseURL }) => {
    
        const loginPage = new LoginPage(page);
        await loginPage.goToLoginPage(baseURL);
        const registerPage: RegisterPage = await loginPage.navigateToRegisterPage();
        const isUserRegistered = await registerPage.registerUser(
            user.firstName,
            user.lastName,
            getRandomEmail(),
            user.telephone,
            user.password,
            user.subscribeNewsletter);
        expect(isUserRegistered).toBeTruthy();

    });
}

function getRandomEmail() : string{
    const randomValue = Math.random().toString(36).substring(2, 9);
    return `auto_${randomValue}@nal.com`;
}



