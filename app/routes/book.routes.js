const express = require("express");
const router = express.Router();

const { validate } = require("../middlewares/validate.middleware");
const { bookSchema } = require("../validations/books.schema");

const {
  getAllbooksController,
  addbookController,
  updatebookController,
  deletebookController,
  getbyidbookController,
  getAllbooksRatingController,
} = require("../controllers/books.controller");

// READ
router.get("/", getAllbooksController);
router.get("/:id", getbyidbookController);

//READ BOOK RATING
router.get("/rating", getAllbooksRatingController);

// CREATE
router.post("/", validate(bookSchema), addbookController);

// UPDATE
router.put("/:id", validate(bookSchema), updatebookController);

// DELETE
router.delete("/:id", deletebookController);

module.exports = router;
