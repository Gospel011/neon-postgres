import express from "express";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";
import { Request, Response } from "express-serve-static-core";
import getLANIP from "./utils/get_lan_ip.js";
import db from "./db/db.js";
import { users } from "./schema/schema.js";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { CreateUserData, userSchema } from "./schema/zod_schema/user.js";
import { ZodError } from "zod";

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
      res: Response<
        ApiResponse<{ posts?: any; results?: number | null; users?: any }>
      >,
    ) => {
      const { page, lat, lng } = req.query;
      const limit = 5;
      const offset = (Math.max(Number(page ?? 1), 1) - 1) * limit;

      const dbUsers = await db.execute<User>(
        sql`
        SELECT 
          id,
          name,
          email,
          age,
          ST_Y(location::geometry) as lat,
          ST_X(location::geometry) as lng
        FROM
          users
        WHERE
          ST_DWithin(
            location,
            ST_SetSRID(ST_MakePoint(${Number(lng)}, ${Number(lat)}), 4326)::geography,
            ${50 * 1000}
          )
        `,
      );

      try {
        res.json({
          status: "success",
          message: "Application is live",
          data: { results: dbUsers.rowCount, users: dbUsers.rows },
        });
      } catch (error) {
        console.error({ error });
        res.json({ status: "failed", message: (error as Error).message });
      }
    },
  )
  .post(
    async (
      req: Request<any, any, CreateUserData>,
      res: Response<ApiResponse<{ user?: any; error?: any }>>,
    ) => {
      try {
        const { name, email, age, lat, lng } = userSchema.parse(req.body, {
          error: () => "Please provide the required parameters",
        });

        const dbResult = await db.execute(
          sql`
          INSERT INTO users (name, email, age, location)
          VALUES (
            ${name},
            ${email},
            ${Number(age)},
            ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography
            )`,
        );

        res.status(200).json({ status: "success", data: { user: dbResult } });
      } catch (error) {
        console.error(error);

        if (error instanceof ZodError) {
          return res.status(400).json({
            status: "failed",
            message: error.issues?.at(0)?.message,
          });
        }
        res.status(400).json({
          status: "failed",
          message: "Something went wrong, please try again later.",
        });
      }
    },
  );

app
  .route("/users/:id")
  .get(
    async (
      req: Request<{ id: string }>,
      res: Response<ApiResponse<{ user: typeof users.$inferSelect }>>,
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

      if (!user) {
        return res
          .status(404)
          .json({ status: "failed", message: "That user was not found" });
      }

      res.json({ status: "success", data: { user } });
    },
  );

app.listen(PORT, () => {
  const lanIp = getLANIP();
  console.log(`App is running successfully on port: ${PORT}.`);

  console.log(`\nLocal base url: http://localhost:${PORT}`);
  if (!!lanIp) console.log(`\nNetwork base url: http://${lanIp}:${PORT}`);
});
