import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

let api = express.Router();

const initApi = async (app) => {
  app.set("json spaces", 2);
  app.use("/api", api);

  //TODO
};

api.use(bodyParser.json());
api.use(cors());

api.get("/", (req, res) => {
  res.json({ message: "Hello, world!" });
});

//TODO

/* Catch-all route to return a JSON error if endpoint not defined.
   Be sure to put all of your endpoints above this one, or they will not be called. */
api.all("/*", (req, res) => {
  res.status(404).json({ error: `Endpoint not found: ${req.method} ${req.url}` });
});

export default initApi;
