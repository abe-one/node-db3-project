const db = require("../../data/db-config");

function find() {
  return db
    .select("sc.*")
    .from("schemes as sc")
    .count("st.step_id as number_of_steps")
    .leftJoin("steps as st", function () {
      this.on("sc.scheme_id", "st.scheme_id");
    })
    .groupBy("sc.scheme_id")
    .orderBy("sc.scheme_id");
}

const getSchemeSteps = (scheme_id) =>
  db
    .select("sc.scheme_name", "st.*")
    .from("schemes as sc")
    .leftJoin("steps as st", function () {
      this.on("sc.scheme_id", "st.scheme_id");
    })
    .where("sc.scheme_id", `${scheme_id}`)
    .orderBy("st.step_number");

async function findById(scheme_id) {
  const scheme = await getSchemeSteps(scheme_id);
  const emptyScheme = {
    scheme_id: scheme_id,
    steps: [],
  };

  const sortedScheme = scheme.reduce((acc, step) => {
    if (!acc.scheme_name) {
      acc.scheme_name = step.scheme_name;
    }

    if (!step.step_id) {
      return acc;
    }

    // eslint-disable-next-line no-unused-vars
    const { scheme_id, scheme_name, ...trimmedStep } = step;
    acc.steps.push(trimmedStep);

    return acc;
  }, emptyScheme);

  return sortedScheme;
}

async function findSteps(scheme_id) {
  const scheme = await getSchemeSteps(scheme_id);

  const sortedScheme = scheme.reduce((acc, step) => {
    if (!step.step_id) {
      return acc;
    }
    // eslint-disable-next-line no-unused-vars
    const { scheme_id, ...trimmedStep } = step;
    acc.push(trimmedStep);
    return acc;
  }, []);

  return sortedScheme;
}

async function add(scheme) {
  const id = await db("schemes").insert(scheme);
  return db("schemes").where("scheme_id", `${id}`);
}

function addStep(scheme_id, step) {
  // EXERCISE E
  /*
    1E- This function adds a step to the scheme with the given `scheme_id`
    and resolves to _all the steps_ belonging to the given `scheme_id`,
    including the newly created one.
  */
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
};
