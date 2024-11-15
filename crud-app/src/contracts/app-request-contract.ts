import { Request } from 'express';
import { JwtPayload } from './jwt-contract';

export interface AppRequest extends Request {
  user: JwtPayload;
}