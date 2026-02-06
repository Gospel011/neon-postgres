CREATE TYPE "public"."roles" AS ENUM('USER', 'ADMIN', 'SUPER_ADMIN');--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"role" "roles" DEFAULT 'USER' NOT NULL,
	"age" integer,
	"created_at" timestamp(0) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(0) with time zone,
	"geog" geography(POINT, 4326)
);
--> statement-breakpoint
CREATE UNIQUE INDEX "unique_email" ON "users" USING btree (lower("email"));--> statement-breakpoint
CREATE INDEX "idx_users_location_gist" ON "users" USING gist ("geog");