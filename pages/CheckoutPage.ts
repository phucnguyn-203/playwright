import { Locator, Page, expect } from "@playwright/test";

export default class CheckoutPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async selectBillingAddressByValue(value: string): Promise<void> {
    await this.page.selectOption('#billing-address-select', value);
  }

  public async verifyBillingAddressSelected(value: string): Promise<void> {
    const selectedAddress = await this.page.$eval('#billing-address-select', (select) => {
      return (select as HTMLSelectElement).value;
    });
    await expect(selectedAddress).toBe(value);
  }

  public getBillingContinueButton(): Locator {
    return this.page.locator('#billing-buttons-container input[type="button"]');
  }

  public async clickContinueButtonOfBillingAddress(): Promise<void> {
    await this.getBillingContinueButton().click();
  }

  public getPickupInStoreCheckbox(): Locator {
    return this.page.locator('#PickUpInStore');
  }

  public async selectPickUpInStore() {
    const isChecked = await this.getPickupInStoreCheckbox().isChecked();
    if (!isChecked) {
      await this.getPickupInStoreCheckbox().check();
    }
  }

  public getContinueButtonOfShippingAddress(): Locator {
    return this.page.locator('#shipping-buttons-container input[type="button"]');
  }

  public async clickContinueButtonOfShippingAddress(): Promise<void> {
    await this.getContinueButtonOfShippingAddress().click();
  }

  public getPaymentMethodRadioButtonById(id: string): Locator {
    return this.page.locator(`input[type="radio"][id="${id}"]`);
  }

  public async selectPaymentMethodById(id: string): Promise<void> {
    await this.getPaymentMethodRadioButtonById(id).check();
  }

  public getContinueButtonOfPaymentMethod(): Locator {
    return this.page.locator('#payment-method-buttons-container input[type="button"]');
  }

  public async clickContinueButtonOfPaymentMethod(): Promise<void> {
    await this.getContinueButtonOfPaymentMethod().click();
  }

  public getContinueButtonOfPaymentInfo(): Locator {
    return this.page.locator('#payment-info-buttons-container input[type="button"]');
  }

  public async clickContinueButtonOfPaymentInfo(): Promise<void> {
    await this.getContinueButtonOfPaymentInfo().click();
  }

  public getConfirmOrderButton(): Locator {
    return this.page.locator('#confirm-order-buttons-container input[type="button"]');
  }

  public async clickConfirmOrderButton(): Promise<void> {
    await this.getConfirmOrderButton().click();
  }


  public async checkOrderSuccessMessageIsVisible(): Promise<void> {
    const successMessage = this.page.locator('.order-completed');
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toContainText('Your order has been successfully processed!');
  }
}