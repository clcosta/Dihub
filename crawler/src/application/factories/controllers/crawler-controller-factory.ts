import { CrawlerController } from "@/application/controllers";
import { makeCrawlerService } from "@/application/factories/services/crawler-service-factory"

export const makeCrawlerController = (): CrawlerController => new CrawlerController(
  makeCrawlerService()
);