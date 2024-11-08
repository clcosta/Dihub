import { ICrawler as ICrawler, Crawler } from "@/data/contracts/crawler";
import { BrowserContext } from "./browser-context";
import * as utils from "./utils";
import * as puppeteer from "puppeteer";
import { ILog, Log } from "@/data/common/log";
import { AppError } from "@/application/errors";

export class CrawlerService implements ICrawler {

  private _currentInstances = 0;

  constructor(
    private readonly log: ILog,
    private readonly browserContext: BrowserContext,
  ) {}

  async execute({ accounts }: Crawler.Params): Promise<Crawler.Result> {
    try{
      if (this._currentInstances === 0) await this.setIntances(1);
      const result: Crawler.Result = {}
      this.log.save({ message: `Starting crawler with ${accounts.length} accounts` });

      // certify the accounts are not duplicated
      if (new Set(accounts.map(acc => acc.username)).size !== accounts.length) {
        throw new AppError().setSysMessage("Duplicated accounts").code(422);
      }

      const promises = accounts.map(async (acc) => {
        const instance = await this.browserContext.getFreeInstance();
        if (result.hasOwnProperty(acc.username)) return
        let userData = null;
        try{
          const products = await this.extractData(acc, instance.context);
          userData = { success: true, data: products };
        } catch (err) {
          this.log.save({ message: `[Instance: ${instance.id}] - Error on account "${acc.username}": ${err.message}`, type: Log.LogLevels.ERROR });
          userData = { success: false, reason: err.message, data: [] };
        }
        result[acc.username] = userData;
        this.browserContext.setIntanceBusy(instance.id, false);
      });
      await Promise.all(promises);

      this.log.save({ message: `crawler finished` });
      return result;
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError().setSysMessage(err.message);
    }
}

  async extractData(account: Crawler.Account, context: puppeteer.BrowserContext): Promise<Crawler.Product> {
    const page = await context.newPage();
    if (!await utils.checkIfLoggedIn(page)) {
      await utils.login(page, account.username, account.password);
    }

    const products = await page.$$('[data-test="inventory-item"]');
    const prices = await Promise.all(products.map(async element => {
      const priceEl = await element.$('[data-test="inventory-item-price"]');
      const price = await priceEl.evaluate(el => el.textContent);
      return +price.replace("$", "");
    }));
    const maxPriceIndex = prices.indexOf(Math.max(...prices));
    const firstProduct = products[maxPriceIndex];

    if (!firstProduct) throw new AppError('Nenhum produto encontrado').setSysMessage("No products found").code(404);
    const productTitle = await firstProduct.$('a[href="#"][data-test$="-title-link"]')
    await productTitle.click();
    await utils.sleep(500);

    const productData = await utils.extractProductData(page);
    return productData;
  }

  async closeAllInstance(): Promise<void> {
    this.log.save({ message: "Closing all browsers contexts" });
    const intancesMap = this.browserContext.getInstancesMap();
    const promises = Array.from(intancesMap.values()).map(async instance => {
      await this.browserContext.closeInstance(instance.id);
    });
    await Promise.all(promises);
  }

  async setIntances(quantity: number): Promise<void> {
    this.log.save({ message: `Change quantity of instances from ${this._currentInstances} to ${quantity}` });
    this._currentInstances = quantity;
    let intancesMap = this.browserContext.getInstancesMap();
    if (intancesMap.size === quantity) return;
    while (intancesMap.size > quantity) {
      const instance = await this.browserContext.getFreeInstance();
      await this.browserContext.closeInstance(instance.id);
      intancesMap = this.browserContext.getInstancesMap();
    }
    while (intancesMap.size < quantity) {
      await this.browserContext.newInstance();
      intancesMap = this.browserContext.getInstancesMap();
    }
  }
}
