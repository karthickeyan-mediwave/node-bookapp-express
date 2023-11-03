const { v4: uuidv4 } = require("uuid");

const books = [];

const booksRating = [];

const getAllbooks = () => books;
const getAllbooksRating = () => booksRating;

// add book rating

const addbookRating = ({ rating }) => {
  const id = uuidv4();
  const b = {
    id,
    rating,
  };
  booksRating.push(b);
  return b;
};

const addbook = ({ title, year }) => {
  const id = uuidv4();
  const m = {
    id,
    title,
    year,
  };
  books.push(m);
  return m;
};
const getbyidbook = ({ id }) => {
  const idx = books.findIndex((m) => m.id == id);
  if (idx === -1) {
    return null;
  }
  return books[idx];
};

const updatebook = ({ id, payload }) => {
  const idx = books.findIndex((m) => m.id == id);
  if (idx === -1) {
    return null;
  }

  books[idx]["title"] = payload["title"];
  books[idx]["year"] = payload["year"];

  return books[idx];
};

const deletebook = ({ id }) => {
  const idx = books.findIndex((m) => m.id == id);
  if (idx === -1) {
    return null;
  }

  const book = books[idx];
  books.splice(idx, 1);
  return book;
};

module.exports = {
  getAllbooks,
  addbook,
  updatebook,
  deletebook,
  getbyidbook,
  getAllbooksRating,
  addbookRating,
};
