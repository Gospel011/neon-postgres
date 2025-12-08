import express from "express";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";
import { Request, Response } from "express-serve-static-core";
import getLANIP from "./utils/get_lan_ip.js";

const app = express();


app.use(cors());
app.use(morgan("dev"));
app.use(express.json())

const PORT = process.env.PORT;

app.get("/", (req: Request, res: Response<ApiResponse>) => {
  res.json({ status: "success", message: "Application is live" });
});

app.listen(PORT, () => {
  const lanIp = getLANIP();
  console.log(`App is running successfully on port: ${PORT}.`);

  console.log(`\nLocal base url: http://localhost:${PORT}`);
  if (!!lanIp) console.log(`\nNetwork base url: http://${lanIp}:${PORT}`);
});
