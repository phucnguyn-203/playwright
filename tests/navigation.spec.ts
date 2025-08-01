import { test } from "@playwright/test";

import { HeaderMenu } from "../infrastructure";
import ProductPage from "../pages/ProductPage";

test.describe("Navigation Tests", () => {
  let headerMenu: HeaderMenu;
  let productPage: ProductPage;


  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    headerMenu = new HeaderMenu(page);
    productPage = new ProductPage(page);
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test('should navigate to the product page when clicking on the product link', async () => {
    const navigationItems = ["Books", "Computers", "Electronics", "Apparel & Shoes", "Digital downloads", "Jewelry", "Gift Cards"];
    for (const item of navigationItems) {
      await headerMenu.clickMainItem(item);
      await productPage.checkProductPageTitle(item);
    }
  });


  test('should navigate to the sublist item when hovering on it', async () => {
    const testData = [
      { item: "Computers", subItems: ["Desktops", "Notebooks", "Accessories"] },
      { item: "Electronics", subItems: ["Camera, photo", "Cell phones"] },
    ];
    for (const { item, subItems } of testData) {
      await headerMenu.verifyListItemsOfSublistVisibleAndPageTitleAfterClickOnSublistItem(item, subItems);
    }
  });
});
