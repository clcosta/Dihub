import { MigrationInterface, QueryRunner } from "typeorm";

export class LogTables1731502662647 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE SCHEMA IF NOT EXISTS logs;
            CREATE TABLE IF NOT EXISTS logs.log_type (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS logs.log (
                id SERIAL PRIMARY KEY,
                message TEXT NOT NULL,
                id_type SMALLINT NOT NULL REFERENCES logs.log_type(id) DEFAULT 1,
                created_at TIMESTAMP DEFAULT NOW()
            );

            INSERT INTO logs.log_type (id, name) VALUES
            (1, 'INFO'),
            (2, 'ERROR'),
            (3, 'FATAL');
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP SCHEMA IF EXISTS logs CASCADE;
        `)
    }

}
