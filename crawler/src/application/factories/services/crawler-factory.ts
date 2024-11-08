import { CrawlerService } from "@/application/services/crawler";
import { LogAdapter } from "@/application/adapters/log-adapter";
import { makeBrowserContext } from "./browser-context-factory";

export const makecrawlerService = (): CrawlerService => {
  return new CrawlerService(
    LogAdapter.getInstance(),
    makeBrowserContext()
  );
}