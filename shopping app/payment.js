require("dotenv").config();
const path = require("path");

const express = require("express");
const csrf = require("csurf");
const expressSession = require("express-session");
const https = require("https");
const cors = require("cors");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const opts = {
  requestCert: true,
  rejectUnauthorized: false,
  key: fs.readFileSync("./code.key", { encoding: "utf-8" }),
  cert: fs.readFileSync("./code.crt", { encoding: "utf-8" }),
};

const createSessionConfig = require("./config/session");
const db = require("./data/database");
const addCsrfTokenMiddleware = require("./middlewares/csrf-token");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const notFoundMiddleware = require("./middlewares/not-found");
const payRoutes = require("./routes/pay.routes");

const port = process.env.PORT_PAY | 5000;

const app = express();
const server = https.createServer(opts, app);

app.use(cors());

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(csrf());

app.use(addCsrfTokenMiddleware);

app.use(payRoutes);

app.use(notFoundMiddleware);

app.use(errorHandlerMiddleware);

let refreshTokens = [];
app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken: accessToken });
  });
});

app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

app.get("/login", (req, res) => {
  //Authenticate user
  const username = req.body.username;
  const user = { name: username };

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30s",
  });
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30s" });
}

db.connectToDatabase()
  .then(function () {
    server.listen(port, () =>
      console.log(`Example app listening on port ${port}!`)
    );
  })
  .catch(function (error) {
    console.log("Failed to connect to the database!");
    console.log(error);
  });
