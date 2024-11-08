import { Router } from "express";
import { crawlerControllerFactory } from "@/application/factories/controllers";
import { adaptExpressRoute } from "@/application/adapters/express-adapter";

export const crawlerRouter = Router()

// TODO: Criar uma rota sem necessidade de passar as contas

crawlerRouter.post('', adaptExpressRoute(crawlerControllerFactory()))
