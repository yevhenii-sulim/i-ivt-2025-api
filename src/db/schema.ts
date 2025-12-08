import { relations } from 'drizzle-orm';
import { integer, pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';

export const userTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  firstname: varchar({ length: 255 }).notNull(),
  lastname: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});

export const userGallery = pgTable('galleries', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  userId: integer()
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
});

export const imagesTable = pgTable('images', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  galleryId: integer()
    .notNull()
    .references(() => userGallery.id, { onDelete: 'cascade' }),
});

export const userRelations = relations(userTable, ({ many }) => ({
  galleries: many(userGallery),
}));

export const galleryRelations = relations(userGallery, ({ one, many }) => ({
  user: one(userTable, {
    fields: [userGallery.userId],
    references: [userTable.id],
  }),
  images: many(imagesTable),
}));

export const imagesRelations = relations(imagesTable, ({ one }) => ({
  gallery: one(userGallery, {
    fields: [imagesTable.galleryId],
    references: [userGallery.id],
  }),
}));
