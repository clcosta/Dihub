import { Module } from '@nestjs/common';
import { PostgresDatasourceModule } from './postgres-datasource';

@Module({
  imports: [PostgresDatasourceModule],
  controllers: [],
  providers: [],
})
export class AppDatasourcesModule {}