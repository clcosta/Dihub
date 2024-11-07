import "../infra";
import { LogAdapter } from "../application/adapters/log-adapter";
import { makeCrawllerService } from "@/application/factories/crawller-factory";
import { Crawller } from "@/data/contracts/crawller";

const start = async () => {
  LogAdapter.getInstance().save({ message: "Start application!" });

  const crawllerService = makeCrawllerService();

  const accounts: Crawller.Account[] = [
    { username: 'standard_user', password: 'secret_sauce' },
    { username: 'locked_out_user', password: 'secret_sauce' },
    // { username: "problem_user", password: "secret_sauce" },
    { username: "performance_glitch_user", password: "secret_sauce" },
    { username: "error_user", password: "secret_sauce" },
    { username: 'visual_user', password: 'secret_sauce' },
  ];

  await crawllerService.setIntances(5);
  const result = await crawllerService.execute({ accounts });
  await crawllerService.closeAllInstance();
  console.log(result);
};

start();
