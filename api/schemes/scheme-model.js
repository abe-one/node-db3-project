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

const getSchemeSteps = async (scheme_id) =>
  await db
    .select("sc.scheme_name", "st.*")
    .from("schemes as sc")
    .leftJoin("steps as st", function () {
      this.on("sc.scheme_id", "st.scheme_id");
    })
    .where("sc.scheme_id", `${scheme_id}`)
    .orderBy("st.step_number");

const findSchemeId = (id) => {
  return db("schemes").where("schemes.scheme_id", id);
};

async function findById(scheme_id) {
  const scheme = await getSchemeSteps(scheme_id);
  const emptyScheme = {
    scheme_id: scheme_id,
    steps: [],
  }; //!Why is await useless here

  const sortedScheme = scheme.reduce((acc, step) => {
    //!but functional here?
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
  // return scheme;
}

async function findSteps(scheme_id) {
  const scheme = await db
    .select("sc.scheme_name", "st.*")
    .from("schemes as sc")
    .leftJoin("steps as st", function () {
      this.on("sc.scheme_id", "st.scheme_id");
    })
    .where("sc.scheme_id", `${scheme_id}`)
    .orderBy("st.step_number");

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
  return db("schemes").where("scheme_id", `${id}`).first();
}

async function addStep(scheme_id, step) {
  await db("steps").insert({ ...step, scheme_id: scheme_id });
  return findSteps(scheme_id);
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
  findSchemeId,
};
