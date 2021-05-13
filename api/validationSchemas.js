const yup = require("yup");

exports.string = yup.string().typeError("invalid scheme_name");

exports.scheme = yup.object({
  scheme_name: yup
    .string("invalid scheme_name")
    .typeError("invalid scheme_name")
    .trim()
    .required("invalid scheme_name"),
});

exports.step = yup.object({
  instructions: yup.string("invalid step").trim().required("invalid step"),

  step_number: yup.number().typeError("invalid step").min(1, "invalid step"),
});
