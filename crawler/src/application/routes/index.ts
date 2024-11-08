import Express from 'express';
import cors from 'cors';
import { env } from '@/infra/env';
import { LogAdapter } from '../adapters/log-adapter';
import { crawllerRouter } from './crawller-routes';

class RoutesClass {
  start = async () => {
    const app = Express();
    app.use(cors())
    app.use(Express.json());
    app.use(Express.urlencoded({ extended: true }));

    app.use('/crawller', crawllerRouter);

    app.listen(env.http.port, () => {
      LogAdapter.getInstance().save({ message: `Server running at http://localhost:${env.http.port}` });
    })
  }
}

export const Routes = new RoutesClass();