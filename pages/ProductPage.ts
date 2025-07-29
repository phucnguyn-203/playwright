import { Locator, Page, expect } from "@playwright/test";

export default class ProductPage {
  private page: Page;
  private pageTitle: Locator;
  private productPageBody: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator(".page-title");
    this.productPageBody = page.locator(".page-body");
  }


  public async selectProductByName(name: string): Promise<void> {
    await this.page.getByRole('link', {
      name: name,
      exact: true,
    }).click();
  }

  public async checkProductPageTitle(title: string): Promise<void> {
    await expect(this.pageTitle).toHaveText(title);
  }

  public getSubCategoryOfProductPage(name: string): Locator {
    return this.productPageBody.locator(".sub-category-item h2 a", {
      hasText: name,
    });
  }

  public async selectSubCategory(name: string): Promise<void> {
    await this.getSubCategoryOfProductPage(name).click();
  }

  public getProductName(name: string): Locator {
    return this.page.locator(".product-name h1", {
      hasText: name,
    });
  }

  public async verifyProductNameIsCorrectAfterSelection(name: string): Promise<void> {
    await expect(this.getProductName(name)).toHaveText(name);
  }

  public async clickAddToCartButton(): Promise<void> {
    await this.page.locator(".add-to-cart-button").click();
  }

  public async verifyNotificationSuccessPresentAfterClickOnAddToCart(): Promise<void> {
    const notification = this.page.locator(".bar-notification.success");
    await expect(notification).toBeVisible();
  }
}