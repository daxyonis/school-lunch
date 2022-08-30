const knex = require('knex');
const knexStringcase = require('knex-stringcase');
const parse = require('date-fns/parse');
const format = require('date-fns/format');

// const types = require('pg').types;
// types.setTypeParser(1082, (val) => val);

// create a cache map
const knexCache = new Map();

const getKnex = (schoolDatabase) => {
  // first check the cache
  let db = knexCache.get(schoolDatabase);

  // if we don't have a knex instance in the cache, create a new one
  if (!db) {
    // create a config with the school database and the env vars
    const config = {
      client: process.env.DB_CLIENT,
      connection: {
        database: schoolDatabase,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        typeCast: function (field, next) {
          if (field.type === 'DATE') {
            return format(
              parse(field.string(), 'yyyy-MM-dd', new Date()),
              'yyyy-MM-dd'
            );
          } else {
            return next();
          }
        },
      },
    };

    const options = knexStringcase(config);
    db = knex(options);

    // since we created a new instance, add to the cache for the next request
    knexCache.set(schoolDatabase, db);
  }
  return db;
};

const passKnexSecured = (req, res, next) => {
  // The JWT information will be populated in req.user
  // get the school_database property from req.user
  const schoolDatabase = req.user['https://school-lunch/school_database'];
  req.knex = getKnex(schoolDatabase);
  next();
};

const passKnexPublic = (req, res, next) => {
  const schoolName = req.params.schoolName;
  const schoolDatabase = schoolName.replace(/-/g, '_');
  req.knex = getKnex(schoolDatabase);
  next();
};

module.exports = { passKnexSecured, passKnexPublic };
