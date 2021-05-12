const Scheme = require("./scheme-model");
const {
  scheme,
} = require("../validationSchemas"); /* If `scheme_id` does not exist in the database:

  status 404
  {
    "message": "scheme with scheme_id <actual id> not found"
  }
*/
const checkSchemeId = (req, res, next) => {
  const id = req.params.id;
  Scheme.findById(id)
    .then((scheme) => {
      if (scheme) {
        req.promisedScheme = scheme;
        next();
      } else {
        res
          .status(404)
          .json({ message: `scheme with scheme_id ${id} not found` });
      }
    })
    .catch(next);
};

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = (req, _res, next) => {
  scheme
    .validate(req.body, { stripUnknown: true })
    .then((validScheme) => {
      req.body = validScheme;
      next();
    })
    .catch(next);
};

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {};

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
};
