ALTER TABLE "users" RENAME COLUMN "geog" TO "location";--> statement-breakpoint
DROP INDEX "idx_users_location_gist";--> statement-breakpoint
CREATE INDEX "idx_users_location_gist" ON "users" USING gist ("location");