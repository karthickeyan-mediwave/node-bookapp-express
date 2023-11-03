var express = require("express");
const dotenv = require("dotenv");
dotenv.config();
var app = express();
app.use(express.json());

const config = require("./config");

let books = [];

// get
app.get("/books", (req, res) => {
  return res.json({
    books,
  });
});
app.get("/books/:id", (request, response) => {
  const accountId = Number(request.params.id);
  const getAccount = books.find((account) => account.id === accountId);
  console.log(accountId);

  if (!getAccount) {
    response.status(500).send("trainee not found.");
  } else {
    response.json(getAccount);
  }
});

// add
app.post("/", (req, res) => {
  books.push({
    id: req.body.id,
    name: req.body.name,
  });
  return res.json({
    message: "books added sucesssfully",
  });
});

// Update

app.put("/books", (request, response) => {
  const accountname = String(request.query.name);
  const body = request.body;
  const account = books.find((account) => account.name === accountname);
  const index = books.indexOf(account);

  if (!account) {
    response.status(500).send("Account not found.");
  } else {
    const updatedAccount = { ...account, ...body };

    books[index] = updatedAccount;

    response.send(updatedAccount);
  }
  return res.json({
    message: "books update sucesssfully",
  });
});
app.put("/books/:id", (request, response) => {
  const accountId = Number(request.params.id);
  const body = request.body;
  const account = books.find((account) => account.id === accountId);
  const index = books.indexOf(account);

  if (!account) {
    response.status(500).send("Account not found.");
  } else {
    const updatedAccount = { ...account, ...body };

    books[index] = updatedAccount;

    response.send(updatedAccount);
  }
});
app.put("/books/", (request, response) => {
  const accountname = String(request.query.id);
  const body = request.body;
  const account = books.find((account) => account.id === accountname);
  const index = books.indexOf(account);

  if (!account) {
    response.status(500).send("Account not found.");
  } else {
    const updatedAccount = { ...account, ...body };

    books[index] = updatedAccount;

    response.send(updatedAccount);
  }
});

// DELETE
app.delete("/books/:id", (request, response) => {
  const accountId = Number(request.params.id);
  let newbooks = books.filter((account) => account.id != accountId);

  if (!newbooks) {
    response.status(500).send("Account not found.");
  } else {
    books = newbooks;
    response.send(trainees);
  }
});

app.listen(3000, () => {
  console.log(`Server running on 3000`);
});
