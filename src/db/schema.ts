import { integer, pgTable, varchar, timestamp, pgEnum, text, serial } from "drizzle-orm/pg-core";
import { v4 } from "uuid";

const timestamps = {
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow().notNull()
}

export const rolesEnum = pgEnum('roles', ['admin', 'user', 'guest']);

export const usersTable = pgTable('users', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    role: rolesEnum().default('user').notNull(),
    age: integer().notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    obs: varchar({ length: 255 }),
    balance: integer().default(100),
    ...timestamps
});

export const pestsTable = pgTable('pests', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    ownerId: integer().notNull().references(() => usersTable.id),
    ...timestamps
}); // Relação 1:N

export const postsTable = pgTable('posts', {
    id: varchar({ length: 100 }).primaryKey().$default(() => v4()),
    title: varchar({ length: 255 }).notNull(),
    body: text(),
    ownerId: integer().notNull().references(() => usersTable.id),
});

export const usuarioTable = pgTable('usuario', {
    id: serial('id').primaryKey(), 
    email: varchar('email', { length: 255 }),
    password: varchar('password', { length: 255 })
});