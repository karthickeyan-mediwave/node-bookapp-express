const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const morgan = require("morgan");
let PORT = process.env.PORT;

const app = express();
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
