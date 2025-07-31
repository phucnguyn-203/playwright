import { Locator, Page } from "@playwright/test";

export default class InputElement {
  private readonly locator: Locator;

  constructor(locator: Locator) {
    this.locator = locator;
  }

  public async fill(value: string): Promise<void> {
    await this.locator.fill(value);
  }

  public async check(): Promise<void> {
    await this.locator.check();
  }

  public static fromName(page: Page, name: string): InputElement {
    return new InputElement(page.locator(`input[name="${name}"]`));
  }

  public static fromId(page: Page, id: string): InputElement {
    return new InputElement(page.locator(`input[id="${id}"]`));
  }

  public static fromType(page: Page, type: string): InputElement {
    return new InputElement(page.locator(`input[type="${type}"]`));
  }
}
