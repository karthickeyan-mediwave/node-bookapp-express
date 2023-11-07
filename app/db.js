const { v4: uuidv4 } = require("uuid");
const { isValidISBN } = require("../app/middlewares/validate.middleware");

const books = [
  {
    id: "12345678",
    title: "dhoom",
    isbn: 0o545010225,
  },
];

const booksRatings = [
  {
    id: "200",
    rating: 3,
    bookid: "12345678",
  },
];
// get book
const getAllBooks = () => books;
// add book
const addBook = ({ title, isbn }) => {
  const id = uuidv4();

  const b = {
    id,
    title,
    isbn,
  };
  books.push(b);
  return b;
};
// add rating
const addRating = ({ rating, bookid }) => {
  const ratingId = uuidv4();

  const bookRating = {
    id: ratingId,
    rating,
    bookid,
  };
  booksRatings.push(bookRating);
  return bookRating;
};
// get book by id
const getBookById = (id) => {
  const book = books.find((b) => b.id == id);

  if (!book) {
    return null;
  }

  const ratingEntry = booksRatings.find((b) => b.bookid == id);

  const rating = ratingEntry ? ratingEntry.rating : 0;

  b = {
    id: book.id,
    title: book.title,
    isbn: book.isbn,
    rating: rating,
  };
  return b;
};
// edit book title
const editBookById = ({ id, title }) => {
  const idx = books.findIndex((b) => b.id == id);
  if (idx != -1) {
    books[idx]["title"] = title;
    return books[idx];
  }
  return null;
};
// delete book
const deleteBookById = (id) => {
  const idx = books.findIndex((b) => b.id == id);
  const ratingidx = booksRatings.findIndex((b) => b.bookId == id);
  if (idx == -1) {
    return null;
  }
  const b = books[idx];
  books.splice(idx, 1);
  if (ratingidx !== -1) {
    const r = booksRatings[ratingidx];
    booksRatings.splice(ratingidx, 1);
    return {
      b,
      r,
    };
  }
  return b;
};
// update rating
const updateRating = ({ rating, bookid }) => {
  const idx = booksRatings.findIndex((b) => b.bookid == bookid);
  if (idx != -1) {
    booksRatings[idx]["rating"] = rating;
    return booksRatings[idx];
  }
  return null;
};
// get rating by id
const getRatingById = (id) => {
  const rating = booksRatings.find((r) => r.id == id);
  if (!rating) {
    return null;
  }
  const book = books.find((b) => b.id == rating.bookid);
  return {
    id: rating.id,
    rating: rating.rating,
    book,
  };
};
// delete rating by id
const deleteRatingById = (id) => {
  const idx = booksRatings.findIndex((r) => r.id == id);
  if (idx == -1) {
    return null;
  }
  const deletedRating = booksRatings[idx];
  booksRatings.splice(idx, 1);
  return deletedRating;
};
// pagination
function paginatedResults(model) {
  return (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};
    if (endIndex < model.length) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    results.results = model.slice(startIndex, endIndex);

    res.paginatedResults = results;
    next();
  };
}
// search

function filteredtitle(searchText) {
  const searchTextLow = searchText.toLowerCase();
  const result = books.filter((m) =>
    m.title.toLowerCase().includes(searchTextLow)
  );
  return result.filter((res) => res.title);
}

module.exports = {
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
  filteredtitle,
};
