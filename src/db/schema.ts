import { integer, pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';
export const usersTable = pgTable('user', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  firstName: varchar('firstname', { length: 255 }).notNull(),
  lastName: varchar('lastname', { length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});
