import { test } from '../fixtures/baseFixtures';
import { dataTest, testWithJson, testWithExcel, expect } from '../fixtures/dataFixture';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';

function getRandomEmail() : string{
    const randomValue = Math.random().toString(36).substring(2, 9);
    return `auto_${randomValue}@nal.com`;
}

  
dataTest('Register a user from CSV', async ({ regData, page, baseURL }) => {
    
    for (const user of regData) {
        const loginPage = new LoginPage(page);
                await loginPage.goToLoginPage(baseURL);
                const registerPage: RegisterPage = await loginPage.navigateToRegisterPage();
                const isUserRegistered: boolean = await registerPage.registerUser(
                    user.firstName,
                    user.lastName,
                    getRandomEmail(),
                    user.telephone,
                    user.password, 
                    user.subscribeNewsletter);
                expect(isUserRegistered).toBeTruthy();
    }
});


testWithJson('Register a user from JSON', async ({ regDataJson, page, baseURL }) => {
    
    for (const user of regDataJson) {
        const loginPage = new LoginPage(page);
                await loginPage.goToLoginPage(baseURL);
                const registerPage: RegisterPage = await loginPage.navigateToRegisterPage();
                const isUserRegistered: boolean = await registerPage.registerUser(
                    user.firstName,
                    user.lastName,
                    getRandomEmail(),
                    user.telephone,
                    user.password, 
                    user.subscribeNewsletter);
                expect(isUserRegistered).toBeTruthy();
    }
});


testWithExcel('Register a user from XLSX', async ({ regDataExcel, page, baseURL }) => {
    
    for (const user of regDataExcel) {
        const loginPage = new LoginPage(page);
                await loginPage.goToLoginPage(baseURL);
                const registerPage: RegisterPage = await loginPage.navigateToRegisterPage();
                const isUserRegistered: boolean = await registerPage.registerUser(
                    user.firstName,
                    user.lastName,
                    getRandomEmail(),
                    user.telephone,
                    user.password, 
                    user.subscribeNewsletter);
                expect(isUserRegistered).toBeTruthy();
    }
});


