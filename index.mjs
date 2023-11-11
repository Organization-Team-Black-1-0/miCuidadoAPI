import "express-async-errors";
import _ from './config.mjs';

import express, { json } from "express";
const index = express();
import connection from "./db.mjs";
import cors from "cors";
const port = 8080;

(async function db() {
  await connection();
})();

index.use(cors());
index.use(json());

// API routes
index.use("/api/v1", require("./Routes/index.route.mjs"));

index.use((error, req, res, next) => {
  console.log(error)
  res.status(500).json({ error: error.message });
});

index.listen(port, () => {
  console.log("Listening to Port ", port);
});

export default index;