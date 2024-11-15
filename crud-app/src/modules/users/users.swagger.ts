import { ApiOperationOptions, ApiResponseOptions } from "@nestjs/swagger";

const basicUserExample = {
  id: '1',
  name: 'John Doe',
  email: 'jonhdoe@email.com',
  createdAt: "2024-11-12T14:54:27.100Z",
  updatedAt: "2024-11-12T14:54:27.100Z"
}

export namespace UsersSwagger {
  export const ApiGetMeDescription: ApiOperationOptions = {
    description: 'Endpoint para buscar os dados do usuário atualmente autenticado',
    summary: 'Busca os dados do usuário autenticado',
  };
  export const ApiGetMeOK: ApiResponseOptions = {
    description: 'Usuário encontrado com sucesso',
    example: basicUserExample,
  };
  export const ApiGetAllUsersDescription: ApiOperationOptions = {
    description: 'Endpoint para buscar todos os usuários cadastrados',
    summary: 'Busca todos os usuários',
  };
  export const ApiGetAllUsersOK: ApiResponseOptions = {
    description: 'Usuários encontrados com sucesso',
    example: [basicUserExample],
  };
  export const ApiCreateUserDescription: ApiOperationOptions = {
    description: 'Endpoint para criar um novo usuário',
    summary: 'Cria um novo usuário',
  };
  export const ApiCreateUserOK: ApiResponseOptions = {
    description: 'Usuário criado com sucesso!',
    status: 201,
    example: basicUserExample,
  };
  export const ApiUpdateUserDescription: ApiOperationOptions = {
    description: 'Endpoint para atualizar os dados do usuário atualmente autenticado',
    summary: 'Atualiza os dados do usuário autenticado',
  }
  export const ApiUpdateUserOK: ApiResponseOptions = {
    description: 'Usuário atualizado com sucesso',
    example: basicUserExample,
  }
  export const ApiDeleteUserDescription: ApiOperationOptions = {
    description: 'Endpoint para deletar o usuário atualmente autenticado',
    summary: 'Deleta o usuário autenticado',
  }
  export const ApiDeleteUserOK: ApiResponseOptions = {
    description: 'Usuário deletado com sucesso',
    status: 204,
  }
}