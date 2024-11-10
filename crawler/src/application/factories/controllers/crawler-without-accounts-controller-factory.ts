import { CrawlerWithoutAccountsController } from "@/application/controllers";
import { makeCrawlerService } from "@/application/factories/services/crawler-service-factory"

export const makeCrawlerWithoutAccountsController = (): CrawlerWithoutAccountsController => new CrawlerWithoutAccountsController(
  makeCrawlerService()
);