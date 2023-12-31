const dotenv = require("dotenv");
dotenv.config();
const config = require("./config");
const express = require("express");
const morgan = require("morgan");
// const app = express();
app.use(express.json());
app.use(morgan("dev"));

const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");

let books = [];
let booksRating = [];
const bookid = uuidv4();

// get
app.get("/books", (req, res) => {
  return res.json({
    books,
  });
});
//get all books rating
app.get("/books/rating", (req, res) => {
  return res.json({
    booksRating,
  });
});

// get particular id
app.get("/books/:id", (req, res) => {
  const accountId = String(req.params.id);
  const getAccount = books.find((account) => account.id === accountId);
  console.log(accountId);

  if (!getAccount) {
    res.status(500).send("books not found.");
  } else {
    const mergedArray = books.map((item) => {
      const matchedObject = booksRating.find((obj) => obj.id === item.id);
      return { ...item, ...matchedObject };
    });

    console.log(mergedArray);
    res.json(mergedArray);
  }
});

app.post("/books", (req, res) => {
  const id = uuidv4();

  function isValidISBN(isbn) {
    let n = isbn.length;
    if (n != 10) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      let digit = isbn[i] - "0";

      if (0 > digit || 9 < digit) return false;

      sum += digit * (10 - i);
    }

    let last = isbn[9];
    if (last != "X" && (last < "0" || last > "9")) return false;

    sum += last == "X" ? 10 : last - "0";

    return sum % 11 == 0;
  }
  let jj = {
    id: bookid,
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

// add rating
app.post("/books/:id/rating", (req, res) => {
  let kk = {
    id: bookid,
    rating: req.body.rating,
  };
  function validateUser(kk) {
    const JoiSchema = Joi.object({
      rating: Joi.number().required().min(0).max(5),
      id: Joi.optional(),
    });

    return JoiSchema.validate(kk);
  }

  response = validateUser(kk);

  if (response.error) {
    return res.json({
      message: "error",
    });
  } else {
    booksRating.push(kk);
    return res.json({
      message: "rating add",
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

app.listen(config.appPort, () => {
  console.log(`Server running on ${config.appPort}`);
});

const express = require("express");
const morgan = require("morgan");
const {
  getAllBooks,
  addBook,
  addRating,
  getBookById,
  editBookById,
  deleteBookById,
  updateRating,
  getRatingById,
  deleteRatingById,
} = require("./db");
const Joi = require("joi");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/books", (req, res) => {
  const books = getAllBooks();
  res.send(books);
});
app.post("/books", (req, res) => {
  const AddbookSchema = Joi.object({
    title: Joi.string().required(),
    isbn: Joi.string().required(),
  });
  const { value, error } = AddbookSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details.map((d) => d.message),
    });
  }
  const book = addBook(value);
  return res.send(book);
});

app.post("/books/:bookid/rating", (req, res) => {
  const ratingSchema = Joi.object({
    rating: Joi.number().min(0).max(5).required(),
  });

  const { value, error } = ratingSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details.map((d) => d.message),
    });
  }

  const rating = addRating({
    rating: req.body.rating,
    bookId: req.params.bookid,
  });
  return res.json(rating);
});

app.get("/books/:bookid", (req, res) => {
  const book = getBookById(req.params.bookid);
  if (!book) {
    return res.status(400).json({
      message: "book not found",
    });
  }
  return res.send(book);
});
app.put("/books/:bookid", (req, res) => {
  const etitSchema = Joi.object({
    title: Joi.string().required(),
  });
  const { value, error } = etitSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details.map((m) => m.message),
    });
  }
  const book = editBookById({ id: req.params.bookid, title: req.body.title });
  if (!book) {
    return res.status(400).json({
      message: "book not found",
    });
  }
  return res.send(book);
});

app.delete("/books/:bookid", (req, res) => {
  const b = deleteBookById(req.params.bookid);
  if (!b) {
    return res.status(400).json({
      message: "book not found",
    });
  }
  res.send(b);
});
app.put("/books/:bookid/rating", (req, res) => {
  const rating = updateRating({
    rating: req.body.rating,
    bookId: req.params.bookid,
  });
  if (!rating) {
    return res.status(400).json({
      message: "rating not found",
    });
  }
  const ratingSchema = Joi.object({
    rating: Joi.number().min(0).max(5).required(),
  });

  const { value, error } = ratingSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details.map((d) => d.message),
    });
  }

  return res.json(rating);
});
app.get("/rating/:ratingid", (req, res) => {
  const book = getRatingById(req.params.ratingid);
  if (!book) {
    return res.status(400).json({
      message: "rating not found",
    });
  }
  return res.send(book);
});

app.delete("/rating/:ratingid", (req, res) => {
  const rating = deleteRatingById(req.params.ratingid);
  if (!rating) {
    return res.status(400).json({
      message: "rating not found ",
    });
  }
  return res.json(rating);
});
