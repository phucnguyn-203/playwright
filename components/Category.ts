import { Locator, Page } from "@playwright/test";

export default class Category {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public getMainCategoryItem(name: string): Locator {
        return this.page.locator(".block-category-navigation ul.list > li > a", {
            hasText: name,
        });
    }

    public getSubCategoryItem(name: string): Locator {
        return this.page.locator(".block-category-navigation ul.list > li > ul > li > a", {
            hasText: name,
        });
    }

    async selectMainCategoryItem(name: string): Promise<void> {
        return this.getMainCategoryItem(name).click();
    }

    async selectSubCategoryItem(name: string): Promise<void> {
        return this.getSubCategoryItem(name).click();
    }
}