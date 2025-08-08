import { pgTable, serial, integer, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const modelEnum = pgEnum('work_model', ['REMOTE', 'ONSITE', 'HYBRID']);

export const typeEnum = pgEnum('job_type', [
	'FULLTIME',
	'PARTTIME',
	'CONTRACT',
	'INTERNSHIP',
	'FREELANCE'
]);

export const applicationStatusEnum = pgEnum('application_status', [
	'APPLIED',
	'INTERVIEWING',
	'OFFER',
	'REJECTED',
	'GHOSTED'
]);

export const application = pgTable('job_application', {
	id: serial('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	role: text('role').notNull(),
	company: text('company').notNull(),
	model: modelEnum('work_model').notNull(),
	type: typeEnum('type').notNull(),
	location: text('location'),
	appliedAt: timestamp('applied_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	notes: text('notes'),
	status: applicationStatusEnum('status').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
});

export const company = pgTable('company', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique(),
	website: text('website'),
	linkedinUrl: text('linkedin_url'),
	crunchbaseUrl: text('crunchbase_url')
});

export const job = pgTable('job', {
	id: serial('id').primaryKey(),
	role: text('role').notNull(),
	companyId: integer('company_id')
		.notNull()
		.references(() => company.id),
	url: text('listing_url').notNull().unique(),
	model: modelEnum('work_model'),
	type: typeEnum('type'),
	location: text('location'),
	description: text('description').notNull(),
	skills: text('skills').notNull(),
	postedOn: timestamp('posted_on', { withTimezone: true, mode: 'date' }),
	validUntil: timestamp('valid_until', { withTimezone: true, mode: 'date' }),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

// Relations
export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	applications: many(application)
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	})
}));

export const applicationRelations = relations(application, ({ one }) => ({
	user: one(user, {
		fields: [application.userId],
		references: [user.id]
	})
}));

export const companyRelations = relations(company, ({ many }) => ({
	jobs: many(job)
}));

export const jobRelations = relations(job, ({ one }) => ({
	company: one(company, {
		fields: [job.companyId],
		references: [company.id]
	})
}));
