import { integer, pgTable, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";

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