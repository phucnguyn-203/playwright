import { Locator, Page, expect } from "@playwright/test";
import Header from "../components/Header";
import InputElement from "../infrastructure/control/InputElement";

export default class LoginPage {
    private readonly page: Page
    private readonly usernameInput: InputElement;
    private readonly passwordInput: InputElement;
    private readonly rememberMeCheckbox: InputElement;
    private readonly loginButton: Locator;

    private readonly header: Header;

    public constructor(page: Page) {
        this.page = page;
        this.header = new Header(page);
        this.usernameInput = InputElement.fromName(page, "Email");
        this.passwordInput = InputElement.fromName(page, "Password");
        this.rememberMeCheckbox = InputElement.fromId(page, "RememberMe");
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

    public async verifyLoginSuccess(username: string): Promise<void> {
        await this.header.isAccountLinkVisible();
        await expect(this.header.getAccountLink()).toHaveText(username);
    }
}
