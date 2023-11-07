const dotenv = require("dotenv");
dotenv.config();

const config = require("./config");
const { addbookSchema, RatingSchema } = require("./validations/books.schema");

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
  paginatedResults,
  // searchtitle,
} = require("./db");
const Joi = require("joi");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

// get books
app.get("/books", (req, res) => {
  const books = getAllBooks();
  res.send(books);
});

// add books
app.post("/books", (req, res) => {
  const { value, error } = addbookSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details.map((d) => d.message),
    });
  }
  const book = addBook(value);
  return res.send(book);
});

/// add rating
app.post("/books/:bookid/rating", (req, res) => {
  const { value, error } = RatingSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details.map((d) => d.message),
    });
  }

  const rating = addRating({
    rating: req.body.rating,
    bookid: req.params.bookid,
  });
  return res.json(rating);
});

// get rating by id
app.get("/books/:bookid", (req, res) => {
  const book = getBookById(req.params.bookid);
  if (!book) {
    return res.status(400).json({
      message: "book not found",
    });
  }
  return res.send(book);
});

// update book title
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

// delete book
app.delete("/books/:bookid", (req, res) => {
  const b = deleteBookById(req.params.bookid);
  if (!b) {
    return res.status(400).json({
      message: "book not found",
    });
  }
  res.send(b);
});

// update rating
app.put("/books/:bookid/rating", (req, res) => {
  const rating = updateRating({
    rating: req.body.rating,
    bookid: req.params.bookid,
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

// get book by rating id
app.get("/rating/:ratingid", (req, res) => {
  const book = getRatingById(req.params.ratingid);
  if (!book) {
    return res.status(400).json({
      message: "rating not found",
    });
  }
  return res.send(book);
});

// delete rating
app.delete("/rating/:ratingid", (req, res) => {
  const rating = deleteRatingById(req.params.ratingid);
  if (!rating) {
    return res.status(400).json({
      message: "rating not found ",
    });
  }
  return res.json(rating);
});

// pagination
const books = getAllBooks();

app.get("/book/paginate", paginatedResults(books), (req, res) => {
  res.json(res.paginatedResults);
});
// // search books
// app.get("/book", (req, res) => {
//   let search = req.query.search;
//   const book = gettitle(search);
//   return res.json(book);
// });
// const gettitle = (search) => {
//   // const book = books.find((r) => r.title == title);
//   let book = books.filter((t) => String(t.title).includes(search));

//   if (!book) {
//     return null;
//   }
//   return {
//     book: book.title,
//   };
// };
app.get("/book", (req, res) => {
  let search = req.query.search;
  const book = filteredtitle(search);
  return res.json(book);
});
function filteredtitle(searchText) {
  const searchTextLow = searchText.toLowerCase();
  const result = books.filter((m) =>
    m.title.toLowerCase().includes(searchTextLow)
  );
  return result.filter((res) => res.title);
}

app.listen(config.appPort, () => {
  console.log(`Server running on ${config.appPort}`);
});
