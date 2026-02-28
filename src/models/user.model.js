import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

export const User = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  roll: varchar('roll', { length: 50 }).notNull().default('user'),
  create_at: timestamp('created_at').notNull().defaultNow(),
  update_at: timestamp('updated_at').notNull().defaultNow(),
});