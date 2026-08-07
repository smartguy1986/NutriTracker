import { pgTable, uuid, text, integer, numeric, date, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  email: text('email'),
  avatar_url: text('avatar_url'),
  calorie_goal: integer('calorie_goal').default(2400),
  onboarded: integer('onboarded').default(0), // 0 for false, 1 for true
  weight: numeric('weight'),
  height: numeric('height'),
  target_weight: numeric('target_weight'),
  activity: text('activity'),
  goal: text('goal'),
  rate: numeric('rate'),
  diet: text('diet'), // We'll store stringified JSON array
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const meals = pgTable('meals', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').references(() => profiles.id).notNull(),
  food_id: text('food_id').notNull(),
  food_name: text('food_name').notNull(),
  meal_type: text('meal_type').notNull(), // 'Breakfast', 'Lunch', 'Snack', 'Dinner'
  quantity: numeric('quantity').notNull(),
  unit: text('unit').notNull(),
  calories: numeric('calories').notNull(),
  protein: numeric('protein').notNull(),
  carbs: numeric('carbs').notNull(),
  fat: numeric('fat').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  logged_date: date('logged_date').default(sql`CURRENT_DATE`).notNull(),
});
