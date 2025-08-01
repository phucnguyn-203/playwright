import { Locator, Page, expect } from "@playwright/test";
import { ProductPage } from "../../pages";

export default class HeaderMenu {

  private readonly page: Page;
  private readonly topMenu: Locator;
  private readonly productPage: ProductPage;

  public constructor(page: Page) {
    this.page = page;
    this.productPage = new ProductPage(page);
    this.topMenu = this.page.locator(`.header-menu .top-menu`);
  }

  public getMainItem(name: string): Locator {
    return this.topMenu.getByRole("link", {
      name: name,
    });
  }

  public async clickMainItem(name: string): Promise<void> {
    return this.getMainItem(name).click();
  }

  public async hoverMainItem(text: string): Promise<void> {
    const item = this.getMainItem(text);
    await item.hover();
  }

  public async isSublistItemVisible(parentMenuText: string, subItemText: string): Promise<void> {
    const parentItem = this.topMenu.locator(`li`, {
      hasText: parentMenuText,
    });
    const sublist = parentItem.locator('ul.sublist.firstLevel.active li a', {
      hasText: subItemText,
    });
    await expect(sublist).toBeVisible();
  }


  public getSublistItem(name: string): Locator {
    return this.topMenu.locator(`.sublist.firstLevel li a`, {
      hasText: name,
    });
  }

  public async clickSublistItem(submenuText: string): Promise<void> {
    const submenuItem = this.getSublistItem(submenuText);
    await submenuItem.click({ force: true });
  }

  public async verifyListItemsOfSublistVisibleAndPageTitleAfterClickOnSublistItem(item: string, subItems: string[]): Promise<void> {
    for (const subItem of subItems) {
      await this.hoverMainItem(item);
      await this.isSublistItemVisible(item, subItem);
      await this.clickSublistItem(subItem);
      await this.productPage.checkProductPageTitle(subItem);
    }
  }
}