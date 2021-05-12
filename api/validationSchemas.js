const yup = require("yup");

exports.scheme = yup.object({
  scheme_name: yup.string().trim().required("invalid scheme_name"),
});

exports.step = yup.object({
  step: yup.string().trim().required("invalid step"),

  step_number: yup.number().typeError("invalid step").min(1, "invalid step"),
});
