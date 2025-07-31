import { pgTable, serial, integer, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';

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
	status: applicationStatusEnum('status').notNull()
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
