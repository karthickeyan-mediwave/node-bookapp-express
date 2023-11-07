const Joi = require("joi");

const patterns = {
  isbnvalidate: /^(?=(?:[^0-9]*[0-9]){10}?$)[\d-]+$/,
};

const addbookSchema = Joi.object({
  title: Joi.string().required(),
  isbn: Joi.string().required().pattern(patterns.isbnvalidate),
});
const RatingSchema = Joi.object({
  rating: Joi.number().required(),
});

module.exports = {
  addbookSchema,
  RatingSchema,
};
