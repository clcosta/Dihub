import { BrowserContext } from "@/application/services/crawller";
import { LogAdapter } from "@/application/adapters/log-adapter";
import { PuppeteerLaunchOptions } from "puppeteer";

export const makeBrowserContext = (launchArgs?: PuppeteerLaunchOptions): BrowserContext => {
  if (!launchArgs) {
    launchArgs = {
      headless: true
    }
  }
  return new BrowserContext(
    LogAdapter.getInstance(),
    launchArgs
  );
}