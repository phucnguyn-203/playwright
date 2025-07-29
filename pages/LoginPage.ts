import { Locator, Page, expect } from "@playwright/test";
import Header from "../components/Header";


export default class LoginPage {
    private readonly page: Page
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly rememberMeCheckbox: Locator;
    private readonly loginButton: Locator;

    private readonly header: Header;

    public constructor(page: Page) {
        this.page = page;
        this.header = new Header(page);
        this.usernameInput = page.locator('input[name="Email"]');
        this.passwordInput = page.locator('input[name="Password"]');
        this.rememberMeCheckbox = page.locator('input[id="RememberMe"]');
        this.loginButton = page.locator('input[type="submit"].login-button');
    }

    public async goToLoginPage(): Promise<void> {
        await this.page.goto("/login");
    }

    public async login(username: string, password: string): Promise<void> {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.rememberMeCheckbox.check();
        await this.loginButton.click();
    }

    public async isLoginSuccessfully(username: string): Promise<void> {
        await this.header.isAccountLinkVisible();
        await expect(this.header.getAccountLink()).toHaveText(username);
    }
}
