import { knex } from "~/db";
import bcrypt from "bcrypt";

const tableName = "users";
const selectableProps = ["id", "firstName", "lastName", "email", "createdAt", "updatedAt"];
const SALT_ROUNDS = 10;

const hashPassword = (password: string) => bcrypt.hash(password, SALT_ROUNDS);
const verifyPassword = (password: string, hash: string) => bcrypt.compare(password, hash);

const beforeSave = async (user: any) => {
    if (!user.password) return Promise.resolve(user);
    return hashPassword(user.password)
        .then(hash => ({ ...user, password: hash }))
        .catch(err => `Error hashing password: ${err}`);
};

export const User = {
    create: async (data: any) => {
        data = await beforeSave(data);
        delete data.id;
        return knex.insert(data).returning(selectableProps).into(tableName);
    },

    findAll: () => knex.select(selectableProps).from(tableName),

    findById: (id: number) => knex.select(selectableProps).from(tableName).where({ id }),

    update: (id: number, data: any) => {
        delete data.id;
        return knex.update(data).from(tableName).where({ id }).returning(selectableProps);
    },

    destroy: (id: number) => knex.del().from(tableName).where({ id }),

    verify: async (username: string, password: string) => {
        const matchErrorMsg = "Username or password do not match";
        return knex
            .select()
            .from(tableName)
            .where({ username })
            .then(user => {
                if (!user) throw matchErrorMsg;
                return user;
            })
            .then((user: any) => Promise.all([user, verifyPassword(password, user.password)]))
            .then(([user, isMatch]) => {
                if (!isMatch) throw matchErrorMsg;
                return user;
            });
    },
};
