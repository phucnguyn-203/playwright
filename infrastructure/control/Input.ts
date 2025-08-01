import { Locator, Page } from "@playwright/test";

export default class Input {
  private readonly locator: Locator;
  private static readonly COMPONENT_TAG = "input";

  constructor(locator: Locator) {
    this.locator = locator;
  }

  public async fill(value: string): Promise<void> {
    await this.locator.fill(value);
  }

  public async check(): Promise<void> {
    await this.locator.check();
  }

  public async click(): Promise<void> {
    await this.locator.click();
  }

  public static fromName(page: Page, name: string): Input {
    return new Input(page.locator(`${Input.COMPONENT_TAG}[name="${name}"]`));
  }

  public static fromId(page: Page, id: string): Input {
    return new Input(page.locator(`${Input.COMPONENT_TAG}[id="${id}"]`));
  }

  public static fromType(page: Page, type: string): Input {
    return new Input(page.locator(`${Input.COMPONENT_TAG}[type="${type}"]`));
  }

  public static fromClass(page: Page, className: string): Input {
    return new Input(page.locator(`${Input.COMPONENT_TAG}.${className}`));
  }
}
