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
} from "drizzle-orm/pg-core";

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
  },
  (table) => [uniqueIndex("unique_email").on(sql`lower(${table.email})`)]
);

export const userPreferences = pgTable("user_preferences", {
  id: integer().generatedByDefaultAsIdentity().primaryKey(),
  emailUpdates: boolean("email_updates").notNull().default(false),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const posts = pgTable("posts", {
  id: uuid().primaryKey().defaultRandom(),
  authorId: integer("author_id").references(() => users.id, {
    onDelete: "set null",
  }),
  title: varchar("title", { length: 256 }).notNull(),
  averageRating: numeric("average_rating", {
    precision: 3,
    scale: 2,
    mode: "number",
  })
    .notNull()
    .default(0),
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
});

export const category = pgTable("categories", {
  id: serial().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
});

export const postCategory = pgTable(
  "post_category",
  {
    postId: uuid()
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    categoryId: integer("category_id")
      .notNull()
      .references(() => category.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.postId, table.categoryId] })]
);

export const userRelations = relations(users, ({ one, many }) => ({
  preferences: one(userPreferences),
  posts: many(posts),
}));

export const postRelations = relations(posts, ({ one, many }) => ({
  users: one(users, { fields: [posts.authorId], references: [users.id] }),
  postCategories: many(postCategory)
}));

export const userPreferencesRelations = relations(
  userPreferences,
  ({ one, many }) => ({
    users: one(users, {
      fields: [userPreferences.userId],
      references: [users.id],
    }),
  })
);
