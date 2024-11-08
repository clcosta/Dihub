import { ILog } from "@/data/common/log";
import { Crawller, IBrowserContext } from "@/data/contracts/crawller";
import * as utils from "./utils";
import * as puppeteer from "puppeteer";
import { AppError } from "@/application/errors";
import { env } from "@/infra/env";

export class BrowserContext implements IBrowserContext {
  private readonly intancesMap: Map<string, Crawller.Instance> = new Map();

  constructor(
    private readonly log: ILog,
    private readonly launchArgs: puppeteer.PuppeteerLaunchOptions
  ) {}

  async getFreeInstance(): Promise<Crawller.Instance> {
    if (this.intancesMap.size === 0) {
      this.log.save({
        message: "No browser instance available, creating new one",
      });
      return await this.newInstance();
    }
    let instance = null;
    let tries = 0;
    while (!instance) {
      const instancesMap = this.getInstancesMap();
      const instance = Array.from(instancesMap.values()).find((i) => !i.busy);
      if (!instance) {
        await utils.sleep(1000);
        if (
          env.crawller.waitingBrowserTimeout !== 0 &&
          tries > env.crawller.waitingBrowserTimeout
        ) {
          throw new AppError("Operação levou mais tempo que o esperado")
            .setSysMessage("Waiting to long for free browser instance")
            .code(408);
        }
        tries++;
        continue;
      }

      this.setIntanceBusy(instance.id, true);
      this.log.save({ message: `Sending browser instance ${instance.id}` });
      return instance;
    }
  }

  async newInstance(): Promise<Crawller.Instance> {
    this.log.save({ message: "Creating new browser context" });
    const browser = await puppeteer.launch(this.launchArgs);
    const context = await browser.createBrowserContext();
    const instance = { id: context.id, context, busy: false };
    this.intancesMap.set(context.id, instance);
    return instance;
  }

  async closeInstance(instanceId: string): Promise<void> {
    if (!this.intancesMap.has(instanceId)) return;
    while (this.intancesMap.get(instanceId).busy) {
      this.log.save({
        message: `Instance ${instanceId} is busy, waiting to close`,
      });
      await utils.sleep(1000);
      break;
    }
    this.log.save({ message: `Closing isntance ${instanceId}` });
    const instance = this.intancesMap.get(instanceId);
    if (!instance) return;
    await instance.context.close();
    this.intancesMap.delete(instanceId);
  }

  getInstancesMap(): ReadonlyMap<string, Crawller.Instance> {
    return new Map(this.intancesMap);
  }

  setIntanceBusy(instanceId: string, busy: boolean): void {
    const instance = this.intancesMap.get(instanceId);
    if (!instance) return;
    instance.busy = busy;
    this.log.save({
      message: `Change intance ${instanceId} status to: ${
        busy ? "busy" : "free"
      }`,
    });
  }
}
