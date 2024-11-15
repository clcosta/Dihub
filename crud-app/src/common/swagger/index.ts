import { ApiResponseOptions } from '@nestjs/swagger';

export const ApiUnauthorized: ApiResponseOptions = {
  description: 'Não autorizado',
  example: {
    message: 'Unauthorized',
    statusCode: 401,
  },
};
