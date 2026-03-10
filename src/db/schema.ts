import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable('users', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    age: integer().notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    obs: varchar({ length: 255 })
});

export const pestsTable = pgTable('pests', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    ownerId: integer().notNull().references(() => usersTable.id)
}); // Relação 1:N