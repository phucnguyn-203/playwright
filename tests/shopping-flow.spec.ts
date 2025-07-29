import { test } from "@playwright/test";

import Header from "../components/Header";
import LoginPage from "../pages/LoginPage";
import Category from "../components/Category";
import ProductPage from "../pages/ProductPage";
import ShoppingCartPage from "../pages/ShoppingCartPage";
import { readJsonFileAsync } from "../utils/fileReader";

let header: Header;
let loginPage: LoginPage;
let category: Category;
let shoppingCartPage: ShoppingCartPage;
let productPage: ProductPage;

test.beforeEach(async ({ page }) => {
    header = new Header(page);
    loginPage = new LoginPage(page);
    category = new Category(page);
    productPage = new ProductPage(page);
    shoppingCartPage = new ShoppingCartPage(page);

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
    // Navigate to Computers category and select Desktop subcategory
    const mainCategory = "Computers";
    await category.selectMainCategoryItem(mainCategory);
    await productPage.checkProductPageTitle(mainCategory);

    const subCategory = "Desktops";
    await productPage.selectSubCategory(subCategory);
    await productPage.checkProductPageTitle(subCategory);

    const productName = "Build your own expensive computer";
    await productPage.selectProductByName(productName);
    await productPage.verifyProductNameIsCorrectAfterSelection(productName);

    // Add product to cart and verify
    await productPage.clickAddToCartButton();
    await productPage.verifyNotificationSuccessPresentAfterClickOnAddToCart();

    // Navigate to shopping cart and verify product details
    await header.clickShoppingCartLink();
    await shoppingCartPage.verifyProductInCart(productName);
    await shoppingCartPage.verifyProductQuantity(productName, "1");
    await shoppingCartPage.verifyProductUnitPrice(productName, "1815.00");
    await shoppingCartPage.verifyProductTotalPrice(productName, "1815.00");

    // Proceed to checkout without accepting terms of service
    await shoppingCartPage.clickCheckoutButton();

});