import { Router } from "express";
import { crawllerControllerFactory } from "@/application/factories/controllers";
import { adaptExpressRoute } from "../adapters/express-adapter";

export const crawllerRouter = Router()

crawllerRouter.use('/', adaptExpressRoute(crawllerControllerFactory()))
