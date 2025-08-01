import { Page, expect } from "@playwright/test";
import { Header, Input } from "../infrastructure";

export default class LoginPage {
    private readonly page: Page
    private readonly usernameInput: Input;
    private readonly passwordInput: Input;
    private readonly rememberMeCheckbox: Input;
    private readonly loginButton: Input;

    private readonly header: Header;

    public constructor(page: Page) {
        this.page = page;
        this.header = new Header(page);
        this.usernameInput = Input.fromId(page, "Email");
        this.passwordInput = Input.fromId(page, "Password");
        this.rememberMeCheckbox = Input.fromId(page, "RememberMe");
        this.loginButton = Input.fromClass(page, "login-button");
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
