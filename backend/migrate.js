const knex = require('knex');
require('dotenv').config();

const getConfig = (databaseName) => {
  return {
    client: process.env.DB_CLIENT,
    connection: {
      database: databaseName,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
  };
};

const migrateDatabases = async () => {
  const defaultKnex = knex(getConfig('information_schema'));
  const catalogDb = await defaultKnex
    .select()
    .from('schemata')
    .where({ schema_name: 'catalog' })
    .first();

  if (!catalogDb) {
    await defaultKnex.raw(`create database catalog`);
  }

  const catalogKnex = knex(getConfig('catalog'));
  await catalogKnex.migrate.latest({
    directory: './database/catalog_migrations',
  });

  const schools = await catalogKnex.select().from('schools');

  for (let i = 0; i < schools.length; i++) {
    const school = schools[i];
    const db = await catalogKnex
      .select()
      .from('information_schema.schemata')
      .where({ schema_name: school.school_database })
      .first();

    if (!db) {
      await catalogKnex.raw(`create database ${school.school_database}`);
    }
    const appKnex = knex(getConfig(school.school_database));
    await appKnex.migrate.latest({
      directory: './database/app_migrations',
    });
  }
  process.exit(0);
};

(async () => {
  migrateDatabases();
})();
