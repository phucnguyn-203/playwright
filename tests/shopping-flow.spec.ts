import { test } from "@playwright/test";

import Header from "../components/Header";
import LoginPage from "../pages/LoginPage";
import Category from "../components/Category";
import ProductPage from "../pages/ProductPage";
import ShoppingCartPage from "../pages/ShoppingCartPage";
import Dialog from "../components/Dialog";
import CheckoutPage from "../pages/CheckoutPage";
import { readJsonFileAsync } from "../utils/fileReader";

let header: Header;
let loginPage: LoginPage;
let category: Category;
let shoppingCartPage: ShoppingCartPage;
let productPage: ProductPage;
let dialog: Dialog;
let checkoutPage: CheckoutPage;

test.beforeEach(async ({ page }) => {
    header = new Header(page);
    dialog = new Dialog(page);
    loginPage = new LoginPage(page);
    category = new Category(page);
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
    await category.selectMainCategoryItemByHref(mainCategory.href);
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
    await dialog.verifyDialogIsVisible();
    await dialog.checkDialogTitle("Terms of service");

    // Close the dialog and accept terms of service
    await dialog.closeDialog();
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