import { knex } from "~/db";
import bcrypt from "bcrypt";

const tableName = "users";
const selectableProps = ["id", "firstName", "lastName", "email", "createdAt", "updatedAt"];
const SALT_ROUNDS = 10;

const hashPassword = (password: string) => bcrypt.hash(password, SALT_ROUNDS);
const verifyPassword = (password: string, hash: string) => bcrypt.compare(password, hash);

export const User = {
    create: async function (data: UserCreateInput) {
        data.password = await hashPassword(data.password);
        return knex.insert(data).returning(selectableProps).into(tableName);
    },

    findAll: function (): Promise<User[]> {
        return knex.select(selectableProps).from(tableName);
    },

    findByEmail: function (email: string): Promise<User> {
        return knex.select(selectableProps).from(tableName).where({ email }).first();
    },

    findById: function (id: number): Promise<User> {
        return knex.select(selectableProps).from(tableName).where({ id }).first();
    },

    update: function (id: number, data: UserUpdateInput): Promise<User> {
        delete data.id;
        return knex.update(data).from(tableName).where({ id }).returning(selectableProps);
    },

    destroy: function (id: number): Promise<number> {
        return knex.del().from(tableName).where({ id });
    },

    verify: async function (email: string, password: string) {
        const matchErrorMsg = "Username or password do not match";
        const user = await knex.select(["password"]).from(tableName).where({ email }).first();
        if (!user || !verifyPassword(password, user.password)) throw matchErrorMsg;
        return user;
    },
};

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserCreateInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface UserUpdateInput {
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
}
