import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1720015938809 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" (
        "id" SERIAL PRIMARY KEY, 
        "first_name" VARCHAR(50) NOT NULL,
        "last_name" VARCHAR(50) NOT NULL,
        "email" VARCHAR(100) NOT NULL UNIQUE,
        "password" VARCHAR(255) NOT NULL,
        "profile_image" VARCHAR(255),
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "is_manager" BOOLEAN NOT NULL DEFAULT FALSE,
        "token" VARCHAR(255)
      );`
    );

    await queryRunner.query(
      `CREATE TABLE to_dos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(50) NOT NULL,
        description VARCHAR(255),
        status VARCHAR NOT NULL,
        assigned_to INTEGER,
        created_at TIMESTAMP NOT NULL
      );`
    );

    await queryRunner.query(
      `INSERT INTO "users" (
        "first_name",
        "last_name",
        "email",
        "password",
        "profile_image",
        "is_manager"
      )
      VALUES (
        'John',
        'Doe',
        'john.doe@gmail.com',
        '$2b$10$suKY8UFXiHSBInQwRP4DvupE6bToA1700Dn/.2ZkWz/amc/JZ/8tu',
        'default.jpg',
        true
      );`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "to_dos"`);
  }
}
