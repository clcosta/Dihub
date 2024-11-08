import { env } from "@/infra/env";
import { Crawler } from "@/data/contracts/crawler";
import { AppError } from "@/application/errors";
import * as puppeteer from "puppeteer";

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const login = async (
  page: puppeteer.Page,
  username: string,
  password: string
): Promise<void> => {
  try {
    await page.goto(env.crawler.loginUrl);
    await page.waitForSelector("#login_button_container");
    await page.type("#user-name", username);
    await page.type("#password", password);
    await page.click("#login-button");
    await page.waitForSelector("#inventory_container", { timeout: 10 * 1000});
    return;
  } catch (err) {
    if (err instanceof puppeteer.TimeoutError) {
      throw new AppError(`Login failed. Invalid Credentials for user "${username}"`).code(409);
    }
    throw new AppError(`Login unexpected failure: ${err.message}`);
  }
};

export const checkIfLoggedIn = async (
  page: puppeteer.Page
): Promise<boolean> => {
  try {
    const inventoyrElement = await page.$("#inventory_container");
    if (!inventoyrElement) return false;
    return await inventoyrElement.isVisible();
  } catch (err) {
    console.error("Unexpected Failure: ", err);
  }
};

export const extractProductData = async (
  page: puppeteer.Page
): Promise<Crawler.Product> => {
  try {
    await page.waitForSelector('[class="inventory_details_desc_container"]');
    const title = await page.$eval(
      '[data-test="inventory-item-name"]',
      (el) => el.textContent
    );
    const desc = await page.$eval(
      '[data-test="inventory-item-desc"]',
      (el) => el.textContent
    );
    const rawPrice = await page.$eval(
      '[data-test="inventory-item-price"]',
      (el) => el.textContent
    );
    const price = +rawPrice.replace("$", "");
    const img = await page.$eval('[class="inventory_details_img"]', (el) =>
      el.getAttribute("src")
    );
    const link = page.url();
    return { title, price, description: desc, rawPrice, img, link };
  } catch (err) {
    if (err instanceof puppeteer.TimeoutError) {
      throw new AppError("Product data extraction failed").code(400);
    }
    throw new AppError(`Product data extraction unexpected failure: ${err}`);
  }
};
