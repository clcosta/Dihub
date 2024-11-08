import { CrawlerController } from "@/application/controllers";
import { makecrawlerService } from "@/application/factories/services/crawler-factory";

export const crawlerControllerFactory = (): CrawlerController => new CrawlerController(
  makecrawlerService()
);