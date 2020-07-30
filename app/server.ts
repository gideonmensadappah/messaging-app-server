import bodyParser = require("body-parser");
import express = require("express");
import chatsController from "./routesController/chatsController";
import userController from "./routesController/userController";
import search from "./routesController/searchController";
const app: express.Application = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL!);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-with, Content-Type, Accept"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT");
    return res.status(200).json({});
  }
  next();
});
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use(chatsController);
app.use(userController);
app.use(search);
export default app;
