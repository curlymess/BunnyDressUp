import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { MongoClient } from "mongodb";

let DATABASE_NAME = "cs193x_final";

let api = express.Router();
let Bunnys;
let Users;

const initApi = async (app) => {
  console.log("api");
  app.set("json spaces", 2);
  app.use("/api", api);

  let conn = await MongoClient.connect("mongodb://127.0.0.1");
  let db = conn.db(DATABASE_NAME);
  Bunnys = db.collection("bunnys");
  Users = db.collection("users");
};

api.use(bodyParser.json());
api.use(cors());
console.log("HERE OKAY");
api.get("/", (req, res) => {
  console.lotg("inside get");
  res.json({ message: "Hello, world!" });
});

// endpoints
api.get("/users", async (req, res) => {
  let users = await Users.find().toArray();
  res.json({
    users: users.map((user) => user.id)
  });
});

api.use("/users/:id", async (req, res, next) => {
  let id = req.params.id;
  let user = await Users.findOne({ id });
  if (!user) {
    res.status(404).json({ error: "User doesn't exist" });
    return;
  }
  res.locals.user = user;
  next();
});

api.get("/users/:id", async (req, res) => {
  let user = res.locals.user;
  let { id, name, avatarURL, following } = user;

  res.json({
    id,
    name,
    avatarURL,
    following
  });
});

// creates the user and puts it in the database but it crashes
api.post("/users", async (req, res) => {
  await Users.insertOne({
    id: req.body.id,
    name: req.body.id,
    avatarURL: "",
    following: []
  });
  let { id, name, avatarURL, following } = await Users.findOne(req.body.id);
  res.json({
    id,
    name,
    avatarURL,
    following
  });
});

api.patch("/users/:id", async (req, res) => {
  let user = res.locals.user;
  if (req.body.name) {
    user.name = req.body.name;
  }
  if (req.body.avatarURL) {
    user.avatarURL = req.body.avatarURL;
  }
  let { id, name, avatarURL, following } = user;
  await Users.replaceOne({ id: user.id }, user);
  res.json({
    id,
    name,
    avatarURL,
    following
  });
});

api.post("/users/:id/savedBunnys", async (req, res) => {
  let user = res.locals.user;
  if (!req.body.text) {
    res.json({ error: "null text" });
    return;
  };
  await Bunnys.insertOne({
    body: "images/bunny.png",
    bg: "images/no.png",
    clothes: "images/no.png",
    extra: "images/no.png",
    user: user,
    id: null
  });
  res.json({ success: true });
});

/* Catch-all route to return a JSON error if endpoint not defined.
   Be sure to put all of your endpoints above this one, or they will not be called. */
api.all("/*", (req, res) => {
  res.status(404).json({ error: `Endpoint not found: ${req.method} ${req.url}` });
});

export default initApi;
