const {
  getAllbooks,
  addbook,
  updatebook,
  deletebook,
  getbyidbook,
  getAllbooksRating,
  addbookRating,
} = require("../db");

/// book rating

const getAllbooksRatingController = (req, res) => {
  const booksRating = getAllbooksRating();
  res.send(booksRating);
};

// add book rating

const addbookRatingController = (req, res) => {
  const booksRating = addbookRating(req.xop);
  res.send(booksRating);
};

const getAllbooksController = (req, res) => {
  const books = getAllbooks();
  res.send(books);
};

const addbookController = (req, res) => {
  const book = addbook(req.xop);
  res.send(book);
};
const getbyidbookController = (req, res, next) => {
  const book = getbyidbook({ id: req.params.id });
  console.log(book);
  if (!book) {
    return next({
      status: 400,
      message: "book not found",
    });
  }
  res.send(book);
};

const updatebookController = (req, res, next) => {
  const book = updatebook({ payload: req.xop, id: req.params.id });
  if (!book) {
    return next({
      status: 400,
      message: "book not updated",
    });
  }
  res.send(book);
};

const deletebookController = (req, res, next) => {
  const book = deletebook({ id: req.params.id });
  if (!book) {
    return next({
      status: 400,
      message: "book not found",
    });
  }
  res.send(book);
};

module.exports = {
  getAllbooksController,
  addbookController,
  updatebookController,
  deletebookController,
  getbyidbookController,
  getAllbooksRatingController,
  addbookRatingController,
};
