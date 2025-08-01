import { test } from "@playwright/test";

import { Header, CategoryMenu, AlertPopup } from "../infrastructure";
import { LoginPage, ProductPage, ShoppingCartPage, CheckoutPage } from "../pages";
import { readJsonFileAsync } from "../utils/fileReader";

let header: Header;
let loginPage: LoginPage;
let categoryMenu: CategoryMenu;
let shoppingCartPage: ShoppingCartPage;
let productPage: ProductPage;
let alertPopup: AlertPopup;
let checkoutPage: CheckoutPage;

test.beforeEach(async ({ page }) => {
    header = new Header(page);
    alertPopup = new AlertPopup(page);
    loginPage = new LoginPage(page);
    categoryMenu = new CategoryMenu(page);
    productPage = new ProductPage(page);
    shoppingCartPage = new ShoppingCartPage(page);
    checkoutPage = new CheckoutPage(page);

    await loginPage.goToLoginPage();
    // Read credentials from file
    const { username, password } = await readJsonFileAsync("test-data/credentials.json");
    await loginPage.login(username, password);
    await loginPage.verifyLoginSuccess(username);
});

test.afterEach(async ({ page }) => {
    await header.clickLogoutLink();
    await page.close();
});

test("should complete the shopping flow successfully", async () => {
    // Read product data from file
    const { mainCategory, subCategory, product, shippingAddress, paymentMethod, orderTotal } = await readJsonFileAsync("test-data/shopping-flow-data.json");

    // Navigate to Computers category and select Desktop subcategory
    await categoryMenu.selectMainCategoryItemByHref(mainCategory.href);
    await productPage.checkProductPageTitle(mainCategory.title);

    await productPage.selectSubCategoryByHref(subCategory.href);
    await productPage.checkProductPageTitle(subCategory.title);

    await productPage.selectProductByHref(product.href);
    await productPage.verifyProductNameIsCorrectAfterSelection(product.name);

    // Add product to cart and verify
    await productPage.fillQuantity(product.quantity);
    await productPage.clickAddToCart();
    await productPage.verifyNotificationSuccessPresentAfterClickOnAddToCart();

    // Navigate to shopping cart and verify product details
    await header.clickShoppingCartLink();
    await shoppingCartPage.verifyProductIsAdded(product.name);
    await shoppingCartPage.verifyProductDetails({
        productName: product.name,
        expectedQuantity: product.quantity,
        expectedUnitPrice: product.unitPrice,
        expectedTotalPrice: product.totalPrice,
    });

    // Proceed to checkout without accepting terms of service
    await shoppingCartPage.clickCheckout();
    await alertPopup.verifyAlertPopupIsVisible();
    await alertPopup.checkAlertPopupTitle("Terms of service");

    // Close the alert popup and accept terms of service
    await alertPopup.closeAlertPopup();
    await shoppingCartPage.checkTermsOfServiceCheckBox();
    await shoppingCartPage.clickCheckout();

    // Select billing address and continue
    await checkoutPage.selectBillingAddressByLabel(shippingAddress);
    await checkoutPage.verifyBillingAddressValueIsSelected(shippingAddress);
    await checkoutPage.clickContinueButtonOfBillingAddress();

    // Select pickup in store option in shipping address
    await checkoutPage.selectPickUpInStore();
    await checkoutPage.clickContinueButtonOfShippingAddress();


    // Select payment method and continue
    await checkoutPage.selectPaymentMethodById(paymentMethod);
    await checkoutPage.clickContinueButtonOfPaymentMethod();

    // Click continue on payment info
    await checkoutPage.clickContinueButtonOfPaymentInfo();
    // Verify order total and confirm order
    await checkoutPage.verifyOrderTotalIsCorrect(orderTotal);
    await checkoutPage.clickConfirmOrderButton();

    // Verify order success message
    await checkoutPage.checkOrderSuccessMessageIsVisible("Your order has been successfully processed!");
});