export const env = {
  api: {
    port: parseInt(process.env.SERVER_PORT, 10) || 3000,
  },
  security: {
    jwt: {
      secret: process.env.JWT_SECRET || 'secret',
      expiration: parseInt(process.env.JWT_EXPIRES_IN, 10) || 5, // 5 minutes
    },
    hash: {
      rounds: parseInt(process.env.HASH_ROUNDS, 10) || 12,
    },
  },
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password',
    name: process.env.DATABASE_NAME || 'dihub',
  }
}