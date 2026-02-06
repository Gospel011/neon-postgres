import { sql, relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  varchar,
  timestamp,
  pgEnum,
  uniqueIndex,
  integer,
  boolean,
  uuid,
  numeric,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";
import geography from "./custom_types/geography.js";

export const role = pgEnum("roles", ["USER", "ADMIN", "SUPER_ADMIN"]);

export const users = pgTable(
  "users",
  {
    id: serial().primaryKey().notNull(),
    name: varchar({ length: 256 }).notNull(),
    email: varchar({ length: 256 }).notNull(),
    role: role().notNull().default("USER"),
    age: integer(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      precision: 0,
      mode: "string",
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      precision: 0,
      mode: "string",
    }),
    location: geography("location", { shape: "POINT", srid: 4326 }),
  },
  (table) => [
    uniqueIndex("unique_email").on(sql`lower(${table.email})`),
    index("idx_users_location_gist").using("gist", table.location),
  ],
);
