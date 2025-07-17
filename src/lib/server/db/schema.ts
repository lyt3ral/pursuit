import { pgTable, integer, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
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

export const jobTypeEnum = pgEnum('job_type', ['REMOTE', 'ONSITE', 'HYBRID']);

export const applicationStatusEnum = pgEnum('application_status', [
	'APPLIED',
	'INTERVIEW',
	'OFFER',
	'REJECTED'
]);

export const application = pgTable('job_application', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	role: text('role').notNull(),
	company: text('company').notNull(),
	type: jobTypeEnum('type').notNull(),
	location: text('location'),
	appliedAt: timestamp('applied_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	notes: text('notes'),
	status: applicationStatusEnum('status').notNull()
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
