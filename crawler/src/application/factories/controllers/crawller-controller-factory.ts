import { CrawllerController } from "@/application/controllers";
import { makeCrawllerService } from "@/application/factories/services/crawller-factory";

export const crawllerControllerFactory = (): CrawllerController => new CrawllerController(
  makeCrawllerService()
);