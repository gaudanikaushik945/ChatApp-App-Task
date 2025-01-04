const express = require("express");
const app = express();
const mongoose = require("./model/db");
const bodyParser = require("body-parser");
const http = require("http");
const { initSocketIo, io } = require("./socketIO/socket");

require("dotenv").config();

const userRouter = require("./routes/user.route");

const server = http.createServer(app);
initSocketIo(server);

app.use(bodyParser.json());
app.use(express.json());

app.use("/api", userRouter);

app.get("/", (req, res) => {
  res.send(
    `------------ localhost serverside connected successfully ---------------- https://localhost:${process
      .env.PORT_NUMBER}`
  );
});

server.listen(process.env.PORT_NUMBER, () => {
  console.log(
    `------------ localhost connected successfully ---------------- https://localhost:${process
      .env.PORT_NUMBER}`
  );
});
