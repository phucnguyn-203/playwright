import { test } from "@playwright/test";

import Header from "../components/Header";
import LoginPage from "../pages/LoginPage";
import Category from "../components/Category";
import ProductPage from "../pages/ProductPage";
import ShoppingCartPage from "../pages/ShoppingCartPage";
import Dialog from "../components/Dialog";
import { readJsonFileAsync } from "../utils/fileReader";
import CheckoutPage from "../pages/CheckoutPage";

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
    await loginPage.isLoginSuccessfully(username);
});

// test.afterEach(async ({ page }) => {
//     await header.clickLogoutLink();
//     await page.close();
// });

test("Shopping Flow Tests", async () => {
    // Read product data from file
    const { mainCategory, subCategory, product } = await readJsonFileAsync("test-data/shopping-flow-data.json");

    // Navigate to Computers category and select Desktop subcategory
    await category.selectMainCategoryItemByHref(mainCategory.href);
    await productPage.checkProductPageTitle(mainCategory.title);

    await productPage.selectSubCategoryByHref(subCategory.href);
    await productPage.checkProductPageTitle(subCategory.title);

    await productPage.selectProductByHref(product.href);
    await productPage.verifyProductNameIsCorrectAfterSelection(product.name);

    // Add product to cart and verify
    await productPage.fillInputQuantity(product.quantity);
    await productPage.clickAddToCartButton();
    await productPage.verifyNotificationSuccessPresentAfterClickOnAddToCart();

    // Navigate to shopping cart and verify product details
    await header.clickShoppingCartLink();
    await shoppingCartPage.verifyProductIsAdded(product.name);
    await shoppingCartPage.verifyProductDetails({
        productName: product.name,
        expectedQuantity: product.quantity,
        expectedUnitPrice: product.unitPrice,
        expectedTotalPrice: `${(product.quantity * product.unitPrice).toFixed(2)}`,
    });

    // Proceed to checkout without accepting terms of service
    await shoppingCartPage.clickCheckoutButton();
    await dialog.verifyDialogIsVisible();
    await dialog.checkDialogTitle("Terms of service");

    // Close the dialog and accept terms of service
    await dialog.closeDialog();
    await shoppingCartPage.checkTermsOfServiceCheckBox();
    await shoppingCartPage.clickCheckoutButton();

    // Select billing address and continue
    await checkoutPage.selectBillingAddressByValue("4376084");
    await checkoutPage.verifyBillingAddressSelected("4376084");
    await checkoutPage.clickBillingContinueButton();

    // Select pickup in store option in shipping address
    await checkoutPage.selectPickUpInStore();
    await checkoutPage.clickShippingAddressContinueButton();


    // Select payment method and continue
    await checkoutPage.selectPaymentMethodById("paymentmethod_1");
    await checkoutPage.clickPaymentContinueButton();
});