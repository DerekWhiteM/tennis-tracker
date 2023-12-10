export function up(knex) {
    return knex.schema.createTable("users", table => {
        table.increments("id");
        table.string("firstName", 50).notNullable();
        table.string("lastName", 50).notNullable();
        table.string("email", 80).unique().notNullable();
        table.string("password", 255).notNullable();
        table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
        table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());
    });
}

export function down(knex) {
    return knex.schema.dropTable("users");
}
