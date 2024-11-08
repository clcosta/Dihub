import { BaseController } from "./base-controller";
import { CrawllerService } from "@/application/services/crawller";
import { IAppRequest } from "@/data/common/controller";
import { HttpResponse } from "@/data/common/http";
import { Crawller } from "@/data/contracts/crawller";
import { AppError } from "@/application/errors";

export class CrawllerController extends BaseController {
  constructor(
    private readonly crawllerService: CrawllerService
  ) {
    super("CrawllerController");
  }

  execute = async ({ accounts, instances }: HttpRequest): Promise<HttpResponse> => {
    await this.crawllerService.setIntances(instances);
    const data = await this.crawllerService.execute({ accounts });
    return HttpResponse.ok({ data });
  };

  override validate({ accounts, instances }: HttpRequest): Error | undefined {
    if (!accounts || !Array.isArray(accounts)) return new AppError().setSysMessage('Body "accounts" is missing');
    if (instances && instances < 1) return new AppError().setSysMessage('Body "instances" must be greater than 0');
  }
}

type HttpRequest = Crawller.Params & IAppRequest;
