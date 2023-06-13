import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { MongoClient } from "mongodb";

// google log in
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
const CLIENT_ID = "297076872738-tpnj678k0m7690tqfu04n6pk75s3osrj.apps.googleusercontent.com";
const JWT_SECRET = "x7GBEEkSv+gOuuE6u8H26v2aZE+//jznEHH85E7I2kg=";
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

// google login endpoints
api.post("/login", async (req, res) => {
  let idToken = req.body.idToken;
  let client = new OAuth2Client();
  let data;
  try {
    /* "audience" is the client ID the token was created for. A mismatch would mean the user is
       trying to use an ID token from a different app */
    let login = await client.verifyIdToken({ idToken, audience: CLIENT_ID });
    data = login.getPayload();
  } catch (e) {
    /* Something when wrong when verifying the token. */
    console.error(e);
    res.status(403).json({ error: "Invalid ID token" });
  }

  /* data contains information about the logged in user. */
  let id = data.email;
  let name = data.name;
  //TODO: Do whatever work you'd like here, such as ensuring the user exists in the database
  /* You can include additional information in the key if you want, as well. */

  /* */
  let apiKey = jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d" });
  res.json({ apiKey });
});

api.use("/protected", async (req, res, next) => {
  /* Return an authentication error. */
  const error = () => {
    res.status(403).json({ error: "Access denied" });
  };
  let header = req.header("Authorization");
  /* `return error()` is a bit cheesy when error() doesn't return anything, but it works (returns undefined) and is convenient. */
  if (!header) return error();
  let [type, value] = header.split(" ");
  if (type !== "Bearer") return error();
  try {
    let verified = jwt.verify(value, SECRET);
    console.log("verified is");
    console.log(verified);
    //TODO: verified contains whatever object you signed, e.g. the user's email address.
    //Use this to look up the user and set res.locals accordingly
    next();
  } catch (e) {
    console.error(e);
    error();
  }
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
  let { id, savedBunnies } = user;

  res.json({
    id,
    savedBunnies
  });
});

// creates the user and puts it in the database but it crashes
api.post("/users", async (req, res) => {
  await Users.insertOne({
    id: req.body.id,
    savedBunnies: []
  });
  let { id, savedBunnies } = await Users.findOne(req.body.id);
  res.json({
    id,
    savedBunnies
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
