const Joi = require("joi");

const bookSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
});
const bookRatingSchema = Joi.object({
  rating: Joi.number().required(),
});

module.exports = {
  bookSchema,
  bookRatingSchema,
};
