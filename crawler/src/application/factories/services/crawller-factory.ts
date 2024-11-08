import { CrawllerService } from "@/application/services/crawller";
import { LogAdapter } from "@/application/adapters/log-adapter";
import { makeBrowserContext } from "./browser-context-factory";

export const makeCrawllerService = (): CrawllerService => {
  return new CrawllerService(
    LogAdapter.getInstance(),
    makeBrowserContext()
  );
}