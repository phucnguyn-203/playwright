import { Locator, Page, expect } from "@playwright/test";
import ButtonContainer from "../infrastructure/control/ButtonContainer";
export default class CheckoutPage {
  private readonly page: Page;
  private readonly buttonContainer: ButtonContainer;

  constructor(page: Page) {
    this.page = page;
    this.buttonContainer = new ButtonContainer(page);
  }

  public async selectBillingAddressByLabel(label: string): Promise<void> {
    await this.page.selectOption('#billing-address-select', { label });
  }

  public async verifyBillingAddressValueIsSelected(label: string): Promise<void> {
    const selectedOption = this.page.locator('#billing-address-select option:checked');
    await expect(selectedOption).toHaveText(label);
  }


  public async clickContinueButtonOfBillingAddress(): Promise<void> {
    await this.buttonContainer.getContinueButtonById('billing').click();
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

  public async clickContinueButtonOfShippingAddress(): Promise<void> {
    await this.buttonContainer.getContinueButtonById('shipping').click();
  }

  public getPaymentMethodRadioButtonById(id: string): Locator {
    return this.page.locator(`input[type="radio"][id="${id}"]`);
  }

  public async selectPaymentMethodById(id: string): Promise<void> {
    await this.getPaymentMethodRadioButtonById(id).check();
  }


  public async clickContinueButtonOfPaymentMethod(): Promise<void> {
    await this.buttonContainer.getContinueButtonById('payment-method').click();
  }

  public async clickContinueButtonOfPaymentInfo(): Promise<void> {
    return this.buttonContainer.getContinueButtonById('payment-info').click();
  }

  public async verifyOrderTotalIsCorrect(expectedTotal: string): Promise<void> {
    const orderTotalLocator = this.page.locator('.order-total');
    await expect(orderTotalLocator).toHaveText(expectedTotal);
  }

  public async clickConfirmOrderButton(): Promise<void> {
    await this.buttonContainer.getContinueButtonById('confirm-order').click();
  }


  public async checkOrderSuccessMessageIsVisible(message: string): Promise<void> {
    const successMessage = this.page.locator('.order-completed');
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toContainText(message);
  }
}