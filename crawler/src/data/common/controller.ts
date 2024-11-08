import { Request, Response, NextFunction } from "express";


export interface IController{
    handle(req:Request, res: Response, next: NextFunction):Promise<Response | NextFunction>
}

export interface IAppRequest extends Request {}