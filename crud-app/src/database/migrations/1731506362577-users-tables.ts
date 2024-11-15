import { MigrationInterface, QueryRunner } from "typeorm";

export class  UsersTables1731506362577 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE SCHEMA IF NOT EXISTS users;
            CREATE TABLE IF NOT EXISTS users.user (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW(),
                deleted_at TIMESTAMP
            )
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP SCHEMA IF EXISTS users CASCADE;
        `)
    }

}
