import { CrawlerService } from "@/application/services/crawler/crawler-service";
import { LogAdapter } from "@/application/adapters/log-adapter";
import { makeBrowserContext } from "./browser-context-factory";

export const makeCrawlerService = (): CrawlerService => {
  return new CrawlerService(
    LogAdapter.getInstance(),
    makeBrowserContext()
  );
}