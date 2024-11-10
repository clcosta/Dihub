import { Router } from "express";
import { makeCrawlerController, makeCrawlerWithoutAccountsController } from "@/application/factories/controllers";
import { adaptExpressRoute } from "@/application/adapters/express-adapter";

export const crawlerRouter = Router()

crawlerRouter.get('', adaptExpressRoute(makeCrawlerWithoutAccountsController()))
crawlerRouter.post('', adaptExpressRoute(makeCrawlerController()))
