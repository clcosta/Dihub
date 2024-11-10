import { BaseController } from "./base-controller";
import { CrawlerService } from "@/application/services/crawler/crawler-service";
import { IAppRequest } from "@/data/common/controller";
import { HttpResponse } from "@/data/common/http";
import { Crawler } from "@/data/contracts/crawler";
import { AppError } from "@/application/errors";

export class CrawlerController extends BaseController {
  constructor(
    private readonly crawlerService: CrawlerService
  ) {
    super("crawlerController");
  }

  execute = async ({ accounts, instances }: HttpRequest): Promise<HttpResponse> => {
    try{
      await this.crawlerService.setIntances(instances);
      const data = await this.crawlerService.execute({ accounts });
      return HttpResponse.ok({ data });
    } catch (err) {
      if (err instanceof AppError) throw err;
      return HttpResponse.serverError(err);
    } finally {
      await this.crawlerService.closeAllInstances()
    }
  };

  override validate({ accounts, instances }: HttpRequest): Error | undefined {
    if (!accounts || !Array.isArray(accounts)) return new AppError().setSysMessage('accounts is missing');
    if (instances !== undefined && instances <= 0) return new AppError().setSysMessage('instances must be greater than 0');
  }
}

type HttpRequest = Crawler.Params & IAppRequest;
