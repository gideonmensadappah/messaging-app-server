require("dotenv");
import bodyParser = require("body-parser");
import express = require("express");
import chatsController from "./routesController/chatsController";
import userController from "./routesController/userController";
const app: express.Application = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(chatsController);
app.use(userController);
export { app };
