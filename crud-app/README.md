# NestJS

Desenvolva uma API que permita a criação, leitura, atualização e exclusão (CRUD) de recursos de `usuarios`. Utilize conceitos arquiteturais.

## Requisitos

### Obrigatórios

- [X] Rotas CRUD completas
- [X] Validação de dados de entrada
- [X] Documentação básica usando Swagger

### Opcionais

- [X] Testes
- [X] Docker
- [X] Autenticação JWT

## Como rodar o projeto

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto ou defina as variáveis de ambiente no seu sistema operacional.

| Variável | Descrição | Padrão |
| --- | --- | --- |
| `SERVER_PORT` | Porta do servidor | `3000` |
| `JWT_SECRET` | Chave secreta para autenticação | |
| `JWT_EXPIRES_IN` | Tempo de expiração do token JWT em minutos | `90` |
| `HASH_ROUNDS` | Número de rounds para gerar o hash da senha | `12` |
| `DATABASE_HOST` | Host do banco de dados | `localhost` |
| `DATABASE_PORT` | Porta do banco de dados | `5432` |
| `DATABASE_USER` | Usuário do banco de dados | `postgres` |
| `DATABASE_PASSWORD` | Senha do banco de dados | `postgres123` |
| `DATABASE_NAME` | Nome do banco de dados | `postgres` |

OBS: O docker utiliza o padrão de cada variável para rodar o projeto, sendo necessário definir apenas a `JWT_SECRET`.

### Docker
```sh
docker compose up
```

### npm
```sh
npm i
```
```sh
npm run start
```
