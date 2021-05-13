const Scheme = require("./scheme-model");
const { scheme, step } = require("../validationSchemas");
/* If `scheme_id` does not exist in the database:

  status 404
  {
    "message": "scheme with scheme_id <actual id> not found"
  }
*/
const checkSchemeId = (req, res, next) => {
  const id = req.params.scheme_id;
  Scheme.findSchemeId(id)
    .then((scheme) => {
      console.log(scheme);
      if (scheme.length !== 0) {
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
  // if (!req.boy) {
  //   next({ message: "invalid scheme_name", status: 400 });
  // }
  scheme
    .validate(req.body, { stripUnknown: true })
    .then((validScheme) => {
      req.body = validScheme;
      next();
    })
    .catch((err) => next({ message: err.message, status: 400 }));
};

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, _res, next) => {
  step
    .validate(req.body, { stripUnknown: true })
    .then((validStep) => {
      req.body = validStep;
      next();
    })
    .catch((err) => next({ message: err.message, status: 400 }));
};

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
};
