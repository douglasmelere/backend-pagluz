import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1751492333318 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Conditionally create users_role_enum
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'users_role_enum') THEN
          CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user', 'viewer');
        END IF;
      END $$;
    `);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "role" "public"."users_role_enum" NOT NULL DEFAULT 'user',
        "isActive" boolean NOT NULL DEFAULT true,
        "lastLogin" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
      )
    `);

    // Conditionally create customers_installationtype_enum
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'customers_installationtype_enum') THEN
          CREATE TYPE "public"."customers_installationtype_enum" AS ENUM('residential', 'commercial', 'industrial', 'rural');
        END IF;
      END $$;
    `);

    // Conditionally create customers_customertype_enum
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'customers_customertype_enum') THEN
          CREATE TYPE "public"."customers_customertype_enum" AS ENUM('generator', 'consumer');
        END IF;
      END $$;
    `);

    // Conditionally create customers_status_enum
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'customers_status_enum') THEN
          CREATE TYPE "public"."customers_status_enum" AS ENUM('lead', 'prospect', 'client', 'inactive');
        END IF;
      END $$;
    `);

    // Create customers table
    await queryRunner.query(`
      CREATE TABLE "customers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "phone" character varying NOT NULL,
        "cpfCnpj" character varying,
        "address" character varying NOT NULL,
        "city" character varying NOT NULL,
        "state" character varying NOT NULL,
        "zipCode" character varying NOT NULL,
        "complement" character varying,
        "installationType" "public"."customers_installationtype_enum" NOT NULL DEFAULT 'residential',
        "customerType" "public"."customers_customertype_enum" NOT NULL DEFAULT 'consumer',
        "monthlyEnergyConsumption" numeric(10,2),
        "monthlyEnergyBill" numeric(10,2),
        "roofType" character varying,
        "availableRoofArea" numeric(10,2),
        "status" "public"."customers_status_enum" NOT NULL DEFAULT 'lead',
        "notes" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "lastContactDate" TIMESTAMP,
        CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "customers"`);
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."customers_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."customers_customertype_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."customers_installationtype_enum"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."users_role_enum"`);
  }
}
