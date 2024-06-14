const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const errorMiddleware = require("./src/middleware/errorMiddleware");
const router = require("./src/api/apiRoutes");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());
const db_connect = require("./utility/db");
const port = process.env.Port || 5000;

app.get("/", (req, res) => {
  res.send("server is up and running!");
});
app.use("/api/v1", router);
app.use(errorMiddleware);

//db connection
db_connect();
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
