CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"role" "roles" DEFAULT 'USER' NOT NULL,
	"date_of_birth" timestamp (0) with time zone,
	"created_at" timestamp(0) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(0) with time zone
);
--> statement-breakpoint
CREATE UNIQUE INDEX "unique_email" ON "users" USING btree (lower("email"));