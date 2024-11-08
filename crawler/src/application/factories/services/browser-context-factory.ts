import { BrowserContext } from "@/application/services/crawller/browser-context"
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