import { relations } from "drizzle-orm/relations";
import { visitors, visits, owner } from "./schema";

export const visitsRelations = relations(visits, ({one}) => ({
	visitor: one(visitors, {
		fields: [visits.visitorId],
		references: [visitors.id]
	}),
	owner: one(owner, {
		fields: [visits.flatId],
		references: [owner.flatNumber]
	}),
}));

export const visitorsRelations = relations(visitors, ({many}) => ({
	visits: many(visits),
}));

export const ownerRelations = relations(owner, ({many}) => ({
	visits: many(visits),
}));