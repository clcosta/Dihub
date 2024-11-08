import { BaseController } from '@/application/controllers'
import { IAppRequest } from '@/data/common/controller'
import { RequestHandler, Response } from 'express'

export const adaptExpressRoute = ({ handle }: BaseController): RequestHandler => {
    return (async (req: IAppRequest, res: Response) => {
        const response = await handle({ 
            ...req.body, 
            ...req.params, 
            ...req.query, 
        })

        res.status(response?.code ?? 200).set(response?.headers)
        let responseType = "json"
        if (response && response.type) {
            responseType = response.type
            delete response.type
        }
        if (response && responseType === "json") res.json(response)
    }) as RequestHandler
}
