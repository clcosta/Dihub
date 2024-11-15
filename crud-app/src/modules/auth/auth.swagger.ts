import { ApiOperationOptions, ApiResponseOptions } from '@nestjs/swagger';

export namespace AuthSwagger {
  export const ApiLoginDescription: ApiOperationOptions = {
    description: 'Endpoint para gerar token de acesso à API',
    summary: 'Realiza login na API',
  };
  export const ApiLoginOK: ApiResponseOptions = {
    description: 'Login realizado com sucesso',
    example: {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWRtaW4iLCJpY29kIjoiMSIsImlhdCI6MTYyNzQwNjYwMCwiZXhwIjoxNjI3NDA2NjAwfQ.1J9Z6J9J9Z6J9',
      validUntil: 1727989957482,
    },
  };
}
