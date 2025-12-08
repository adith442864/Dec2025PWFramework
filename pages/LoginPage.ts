import { Locator, Page } from '@playwright/test';
import { ElementUtil } from '../utils/ElementUtil';
import { HomePage } from '../pages/HomePage';
import { RegisterPage } from '../pages/RegisterPage';



export class LoginPage{

    //1. page locators/objects/OR:
    private readonly page: Page;
    private readonly eleUtil;
    private readonly emailId: Locator;
    private readonly pasword: Locator;
    private readonly loginBtn: string;
    private readonly warningMsg: Locator;
    private readonly registerlink: Locator;

    //2. page class constructor...
    constructor(page: Page) {
        this.page = page;
        this.eleUtil = new ElementUtil(page);
        this.emailId = page.getByRole('textbox', { name: 'E-Mail Address' });
        this.pasword = page.getByRole('textbox', { name: 'Password' });
        this.loginBtn = 'input[type="submit"][value="Login"]';
        this.warningMsg = page.locator('.alert.alert-danger.alert-dismissible');
        this.registerlink = page.getByText('Register', { exact: true });
    }

    //3. page actions/methods:
    /**
     * navigate to the login page
     */
    async goToLoginPage(baseURL: string | undefined) {
        await this.page.goto(baseURL+'?route=account/login');
    }

    /**
     * login to app using username/password
     * @param email 
     * @param password 
     * @returns 
     */
    async doLogin(email: string, password: string): Promise<HomePage> {
        await this.eleUtil.fill(this.emailId, email);
        await this.eleUtil.fill(this.pasword, password);
        await this.eleUtil.click(this.loginBtn, { force: true, timeout: 5000 });
        return new HomePage(this.page);
    }

    /**
     * get the warning message in case of invalid login
     * @returns 
     */
    async getInvalidLoginMessage(): Promise<string | null> {
        const errorMesg = await this.eleUtil.getText(this.warningMsg);
        console.log('invalid login warning message: ' + errorMesg);
        return errorMesg;
    }

    async navigateToRegisterPage(): Promise<RegisterPage> {
        await this.eleUtil.click(this.registerlink, { force: true }, 1);
        return new RegisterPage(this.page);
    }




}