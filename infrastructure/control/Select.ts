import { Page, Locator, expect } from '@playwright/test';

export default class Select {
  private readonly page: Page;
  private readonly locator: Locator;
  private static readonly COMPONENT_TAG = 'select';

  constructor(page: Page, locator: Locator) {
    this.page = page;
    this.locator = locator;
  }

  public async selectOptionByLabel(label: string): Promise<void> {
    await this.locator.selectOption({ label });
  }

  public async verifyValueIsSelected(label: string): Promise<void> {
    const selectedOption = this.locator.locator(`option:checked`);
    await expect(selectedOption).toHaveText(label);
  }

  public static fromId(page: Page, id: string): Select {
    return new Select(page, page.locator(`${Select.COMPONENT_TAG}[id="${id}"]`));
  }

  public static fromName(page: Page, name: string): Select {
    return new Select(page, page.locator(`${Select.COMPONENT_TAG}[name="${name}"]`));
  }

  public static fromClass(page: Page, className: string): Select {
    return new Select(page, page.locator(`${Select.COMPONENT_TAG}.${className}`));
  }
}