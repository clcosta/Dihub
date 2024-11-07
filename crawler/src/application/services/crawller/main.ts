import { ICrawller, Crawller } from "@/data/contracts/crawller";
import { BrowserContext } from "./browser-context";
import * as utils from "./utils";
import * as puppeteer from "puppeteer";
import { ILog, Log } from "@/data/contracts/log";
import { AppError } from "@/application/errors";

export class CrawllerService implements ICrawller {

  private _currentInstances = 0;

  constructor(
    private readonly log: ILog,
    private readonly browserContext: BrowserContext,
  ) {}

  async execute({ accounts }: Crawller.Params): Promise<Crawller.Result> {
    try{
      if (this._currentInstances === 0) await this.setIntances(1);
      const result: Crawller.Result = {}
      this.log.save({ message: `Starting crawller with ${accounts.length} accounts` });

      // certify the accounts are not duplicated
      if (new Set(accounts.map(acc => acc.username)).size !== accounts.length) {
        throw new AppError("Duplicated accounts").code(422);
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

      this.log.save({ message: `Crawller finished` });
      return result;
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(`Unexpected failure: ${err.message}`);
    }
}

  async extractData(account: Crawller.Account, context: puppeteer.BrowserContext): Promise<Crawller.Product> {
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

    if (!firstProduct) throw new AppError("No products found");
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
