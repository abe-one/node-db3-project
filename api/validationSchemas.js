const yup = require("yup");

exports.scheme = yup.object({
  scheme_name: yup.string().trim().required("invalid scheme_name"),
});
