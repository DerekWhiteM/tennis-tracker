import dotenv from "dotenv";
dotenv.config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
    development: {
        client: "pg",
        connection: process.env.PG_CONNECTION_STRING,
        searchPath: ["knex", "public"],
        migrations: {
            tableName: "migrations",
        },
    },
    production: {
        client: "pg",
        connection: process.env.PG_CONNECTION_STRING,
        searchPath: ["knex", "public"],
        migrations: {
            tableName: "migrations",
        },
    },
};
