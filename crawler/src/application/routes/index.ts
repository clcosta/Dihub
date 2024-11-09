import Express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '@/infra/swagger.json';
import { env } from '@/infra/env';
import { LogAdapter } from '@/application/adapters/log-adapter';
import { crawlerRouter } from './crawler-routes';

class RoutesClass {
  start = async () => {
    const app = Express();
    app.use(cors())
    app.use(Express.json());
    app.use(Express.urlencoded({ extended: true }));

    app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    app.use('/crawler', crawlerRouter);

    app.listen(env.http.port, () => {
      console.log(`API documentation at http://localhost:${env.http.port}/api`);
      LogAdapter.getInstance().save({ message: `Server running at http://localhost:${env.http.port}` });
    })
  }
}

export const Routes = new RoutesClass();