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

async function findById(scheme_id) {
  const scheme = await db
    .select("sc.scheme_name", "st.*")
    .from("schemes as sc")
    .leftJoin("steps as st", function () {
      this.on("sc.scheme_id", "st.scheme_id");
    })
    .where("sc.scheme_id", `${scheme_id}`)
    .orderBy("st.step_number");

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

function findSteps(scheme_id) {
  // EXERCISE C
  /*
    1C- Build a query in Knex that returns the following data.
    The steps should be sorted by step_number, and the array
    should be empty if there are no steps for the scheme:

      [
        {
          "step_id": 5,
          "step_number": 1,
          "instructions": "collect all the sheep in Scotland",
          "scheme_name": "Get Rich Quick"
        },
        {
          "step_id": 4,
          "step_number": 2,
          "instructions": "profit",
          "scheme_name": "Get Rich Quick"
        }
      ]
  */
}

function add(scheme) {
  // EXERCISE D
  /*
    1D- This function creates a new scheme and resolves to _the newly created scheme_.
  */
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
