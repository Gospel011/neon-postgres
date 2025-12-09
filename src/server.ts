import express from "express";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";
import { Request, Response } from "express-serve-static-core";
import getLANIP from "./utils/get_lan_ip.js";
import db from "@db/db.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const PORT = process.env.PORT;

app.get(
  "/",
  async (
    req: Request,
    res: Response<ApiResponse<{ posts?: any; users?: any }>>
  ) => {
    const { page } = req.query;
    const limit = 5;
    const offset = (Math.max(Number(page ?? 1), 1) - 1) * limit
    const client = await db.connect();

    try {
      const users = (await client.query(`SELECT * FROM users ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`)).rows;
    //   const user = (
    //     await client.query("SELECT * FROM users WHERE country = 'Canada'")
    //   ).rows;

      res.json({
        status: "success",
        message: "Application is live",
        data: { users },
      });
    } catch (error) {
      console.error({ error });
      res.json({ status: "failed", message: (error as Error).message });
    } finally {
      client.release();
    }
  }
);

app.listen(PORT, () => {
  const lanIp = getLANIP();
  console.log(`App is running successfully on port: ${PORT}.`);

  console.log(`\nLocal base url: http://localhost:${PORT}`);
  if (!!lanIp) console.log(`\nNetwork base url: http://${lanIp}:${PORT}`);
});
