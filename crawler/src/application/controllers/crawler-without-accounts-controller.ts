import { HttpResponse } from "@/data/common/http";
import { CrawlerService } from "@/application/services/crawler";
import { BaseController } from "./base-controller";
import { AppError } from "../errors";

export class CrawlerWithoutAccountsController extends BaseController {
  constructor(
    private readonly crawlerService: CrawlerService
  ) {
    super("CrawlerWithoutAccountsController");
  }

  execute = async (): Promise<HttpResponse> => {
    try {
      const accounts = await this.crawlerService.extractAccounts();
      const instances = accounts.length / 2;
      await this.crawlerService.setIntances(instances);
      const data = await this.crawlerService.execute({ accounts });
      return HttpResponse.ok({ data });
    } catch (err) {
      if (err instanceof AppError) throw err;
      return HttpResponse.serverError(err);
    } finally {
      await this.crawlerService.closeAllInstances();
    }
  };
}