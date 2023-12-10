import bcrypt from "bcrypt";

export async function seed(knex) {
    const users = await knex("users").first();
    if (users) return;
    await knex("users")
        .returning("id")
        .insert({
            firstName: "Default",
            lastName: "User",
            email: "root",
            password: await bcrypt.hash("root", 10),
        });
}
