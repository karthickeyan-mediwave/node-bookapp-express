const dotenv = require("dotenv");
dotenv.config();

const config = require("./config");

const express = require("express");
const morgan = require("morgan");

// const { notfound } = require("./middlewares/notfound.middleware");
// const { errorHandler } = require("./middlewares/errorhandler.middleware");

// const bookRouter = require("./routes/book.routes");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

// // book routes
// app.use("/books", bookRouter);

// // 404 handler
// app.use(notfound);

// // error handler middleware
// app.use(errorHandler);

const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");

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
    response.status(500).send("books not found.");
  } else {
    response.json(getAccount);
  }
});

// add

////
app.post("/books", (req, res, next) => {
  const id = uuidv4();

  function isValidISBN(isbn) {
    // length must be 10
    let n = isbn.length;
    if (n != 10) return false;

    // Computing weighted sum of
    // first 9 digits
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      let digit = isbn[i] - "0";

      if (0 > digit || 9 < digit) return false;

      sum += digit * (10 - i);
    }

    // Checking last digit.
    let last = isbn[9];
    if (last != "X" && (last < "0" || last > "9")) return false;

    // If last digit is 'X', add 10
    // to sum, else add its value.
    sum += last == "X" ? 10 : last - "0";

    // Return true if weighted sum
    // of digits is divisible by 11.
    return sum % 11 == 0;
  }
  let jj = {
    id: id,
    title: req.body.title,
    isbn: req.body.isbn,
  };

  let isbn = req.body.isbn;

  if (isValidISBN(isbn)) {
    books.push(jj);
    return res.json({
      message: "books added sucesssfully",
    });
  } else {
    return res.json({
      message: "error",
    });
  }
});

// Update

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

// DELETE
app.delete("/books/:id", (request, response) => {
  const accountId = Number(request.params.id);
  let newbooks = books.filter((account) => account.id != accountId);

  if (!newbooks) {
    response.status(500).send("Account not found.");
  } else {
    books = newbooks;
    response.send(books);
  }
});

app.listen(config.appPort, () => {
  console.log(`Server running on ${config.appPort}`);
});
