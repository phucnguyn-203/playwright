// ShoppingCartPage.ts
import { Page, Locator, expect } from '@playwright/test';

export default class ShoppingCartPage {
  private page: Page;
  private cartRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartRows = page.locator('table.cart tbody tr.cart-item-row');
  }

  public getRowByProductName(productName: string): Locator {
    return this.cartRows.filter({ has: this.page.locator('.product-name', { hasText: productName }) });
  }

  public async verifyProductIsAdded(productName: string): Promise<void> {
    const productLocator = this.getRowByProductName(productName);
    await expect(productLocator).toBeVisible();

  }

  public async verifyProductQuantity(productName: string, expectedQty: string): Promise<void> {
    const qtyInput = this.getRowByProductName(productName).locator('input.qty-input');
    await expect(qtyInput).toHaveValue(expectedQty);
  }

  public async verifyProductUnitPrice(productName: string, expectedPrice: string): Promise<void> {
    const priceLocator = this.getRowByProductName(productName).locator('.product-unit-price');
    await expect(priceLocator).toHaveText(expectedPrice);
  }

  public async verifyProductTotalPrice(productName: string, expectedTotal: string): Promise<void> {
    const totalLocator = this.getRowByProductName(productName).locator('.product-subtotal');
    await expect(totalLocator).toHaveText(expectedTotal);
  }

  public getCheckoutButton(): Locator {
    return this.page.locator('#checkout');
  }

  public async clickCheckout(): Promise<void> {
    await this.getCheckoutButton().click();
  }

  public getTermsOfServiceCheckbox(): Locator {
    return this.page.locator('#termsofservice');
  }

  public async checkTermsOfServiceCheckBox(): Promise<void> {
    await this.getTermsOfServiceCheckbox().check();
  }

  public async verifyProductDetails({
    productName,
    expectedQuantity,
    expectedUnitPrice,
    expectedTotalPrice,
  }: {
    productName: string;
    expectedQuantity: string;
    expectedUnitPrice: string;
    expectedTotalPrice: string;
  }): Promise<void> {
    await this.verifyProductQuantity(productName, expectedQuantity);
    await this.verifyProductUnitPrice(productName, expectedUnitPrice);
    await this.verifyProductTotalPrice(productName, expectedTotalPrice);
  }
}
