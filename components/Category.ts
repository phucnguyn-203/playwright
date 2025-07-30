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

    public getMainCategoryItemByHref(href: string): Locator {
        return this.page.locator(`.block-category-navigation ul.list > li > a[href="${href}"]`);
    }

    public async selectMainCategoryItemByHref(href: string): Promise<void> {
        await this.getMainCategoryItemByHref(href).click();
    }

    public async selectMainCategoryItem(name: string): Promise<void> {
        await this.getMainCategoryItem(name).click();
    }

    public async selectSubCategoryItem(name: string): Promise<void> {
        await this.getSubCategoryItem(name).click();
    }
}