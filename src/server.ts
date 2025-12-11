import express from "express";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";
import { Request, Response } from "express-serve-static-core";
import getLANIP from "./utils/get_lan_ip.js";
import db from "./db/db.js";
import { posts, users } from "./schema/schema.js";
import { eq, getTableColumns, sql } from "drizzle-orm";
// import db from "@db/db.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const PORT = process.env.PORT;

app
  .route("/users")
  .get(
    async (
      req: Request,
      res: Response<ApiResponse<{ posts?: any; users?: any }>>
    ) => {
      const { page } = req.query;
      const limit = 5;
      const offset = (Math.max(Number(page ?? 1), 1) - 1) * limit;

      // const dbUsers = await db.select().from(users);
      const dbUsers = await db.query.users.findMany({
        with: { preferences: true },
      });

      try {
        //   ).rows;

        res.json({
          status: "success",
          message: "Application is live",
          data: { users: dbUsers },
        });
      } catch (error) {
        console.error({ error });
        res.json({ status: "failed", message: (error as Error).message });
      }
    }
  )
  .post(
    async (
      req: Request<any, any, { name?: string; email?: string; age?: string }>,
      res: Response<ApiResponse<{ user?: any; error?: any }>>
    ) => {
      const { name, email, age } = req.body;

      if (!name || !email || !age) {
        return res.status(400).json({
          status: "failed",
          message: "Please provide the user name, email and age",
        });
      }

      if (isNaN(Number(age))) {
        return res.status(400).json({
          status: "failed",
          message: "Please provide a valid age",
        });
      }

      try {
        const dbResult = await db
          .insert(users)
          .values({ name, email: email.toLowerCase(), age: Number(age) })
          .returning();

        res.status(200).json({ status: "success", data: { user: dbResult } });
      } catch (error) {
        // console.error(error);
        res.status(400).json({ status: "failed", data: { error } });
      }
    }
  );

app
  .route("/users/:id")
  .get(
    async (
      req: Request<{ id: string }>,
      res: Response<ApiResponse<{ user: typeof users.$inferSelect }>>
    ) => {
      const id = req.params.id;

      if (isNaN(Number(id)))
        return res
          .status(400)
          .json({ status: "failed", message: "Invalid id provided" });

      const user = (
        await db
          .select()
          .from(users)
          .where(eq(users.id, Number(id)))
      )[0];

      // const user = rows[0];

      if (!user) {
        return res
          .status(404)
          .json({ status: "failed", message: "That user was not found" });
      }

      res.json({ status: "success", data: { user } });
    }
  );

app
  .route("/posts")
  .get(async (req, res: Response<ApiResponse<{ posts: any }>>) => {
    const dbPosts = await db
      .select({ ...getTableColumns(posts), author: users })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id));

    // const dbPosts = await db.query.posts.findMany({
    //   with: {
    //     users: { with: { preferences: { columns: { emailUpdates: true } } } },
    //   },
    // });

    res.json({ status: "success", data: { posts: dbPosts } });
  })
  .post(
    async (
      req: Request<any, any, { authorId?: string; title?: string }>,
      res: Response<
        ApiResponse<{ post?: typeof posts.$inferInsert; error?: any }>
      >
    ) => {
      const { authorId, title } = req.body ?? {};

      if (isNaN(Number(authorId)))
        return res.json({
          status: "failed",
          message: "Please provide a valid author id",
        });
      if (!title)
        return res.json({
          status: "failed",
          message: "Please provide the post title",
        });

      try {
        const newPost = (
          await db
            .insert(posts)
            .values({ authorId: Number(authorId), title })
            .returning()
        )[0];

        res.json({ status: "success", data: { post: newPost } });
      } catch (error) {
        res.json({ status: "failed", data: { error } });
      }
    }
  );

app.listen(PORT, () => {
  const lanIp = getLANIP();
  console.log(`App is running successfully on port: ${PORT}.`);

  console.log(`\nLocal base url: http://localhost:${PORT}`);
  if (!!lanIp) console.log(`\nNetwork base url: http://${lanIp}:${PORT}`);
});
