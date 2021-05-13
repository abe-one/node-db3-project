const Scheme = require("./scheme-model");
const { scheme, step, string } = require("../validationSchemas");

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

const validateScheme = async (req, _res, next) => {
  if (!req.body.scheme_name) {
    next({ message: "invalid scheme_name", status: 400 });
  }
  try {
    await string.validate(req.body.scheme_name, { strict: true });
    const validScheme = await scheme.validate(req.body, { stripUnknown: true });
    req.body = validScheme;
    next();
  } catch (err) {
    next({ message: err.message, status: 400 });
  }
};

const validateStep = (req, _res, next) => {
  if (!req.body.instructions) {
    next({ message: "invalid step", status: 400 });
  }
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
