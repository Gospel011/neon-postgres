ALTER TABLE "category" RENAME TO "categories";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "date_of_birth" TO "age";--> statement-breakpoint
ALTER TABLE "post_category" DROP CONSTRAINT "post_category_category_id_category_id_fk";
--> statement-breakpoint
ALTER TABLE "post_category" ADD CONSTRAINT "post_category_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;