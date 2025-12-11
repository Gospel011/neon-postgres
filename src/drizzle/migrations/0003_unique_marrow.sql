CREATE TYPE "public"."roles" AS ENUM('USER', 'ADMIN', 'SUPER_ADMIN');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email" varchar(256);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "roles" DEFAULT 'USER' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_email" ON "users" USING btree (lower("email"));