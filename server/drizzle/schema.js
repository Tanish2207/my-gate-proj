import {
  pgTable,
  integer,
  text,
  unique,
  varchar,
  foreignKey,
  timestamp,
} from "drizzle-orm/pg-core";

export const owner = pgTable(
  "owner",
  {
    id: integer()
      .primaryKey()
      .generatedAlwaysAsIdentity({
        name: "owner_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
      }),
    name: varchar({ length: 255 }).notNull(),
    mobileNumber: varchar("mobile_number", { length: 10 }).notNull(),
    flatNumber: integer("flat_number").notNull(),
  },
  (table) => [unique("owner_flat_number_key").on(table.flatNumber)]
);

export const visitors = pgTable("visitors", {
  id: integer()
    .primaryKey()
    .generatedAlwaysAsIdentity({
      name: "visitors_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
  name: varchar({ length: 255 }).notNull(),
  mobileNumber: varchar("mobile_number", { length: 10 }).notNull(),
});

export const visits = pgTable(
  "visits",
  {
    id: integer()
      .primaryKey()
      .generatedAlwaysAsIdentity({
        name: "visits_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
      }),
    visitorId: integer("visitor_id").notNull(),
    flatId: integer("flat_id").notNull(),
    entryTime: timestamp("entry_time", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    exitTime: timestamp("exit_time", { withTimezone: true, mode: "string" }),
    reason: text(),
  },
  (table) => [
    foreignKey({
      columns: [table.visitorId],
      foreignColumns: [visitors.id],
      name: "visit_visitor_fkey",
    }),
    foreignKey({
      columns: [table.flatId],
      foreignColumns: [owner.flatNumber],
      name: "visit_flat_fkey",
    }),
  ]
);
