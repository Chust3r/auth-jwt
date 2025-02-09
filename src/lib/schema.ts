import time from 'dayjs'
import { relations } from 'drizzle-orm'
import { sqliteTable as table, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { nanoid } from 'nanoid'

export const users = table('users', (t) => ({
	id: t
		.text()
		.primaryKey()
		.$defaultFn(() => nanoid()),
	email: t.text().unique().notNull(),
	password: t.text().notNull(),
	createdAt: t.text().$defaultFn(() => time().toISOString()),
	updatedAt: t.text().$onUpdateFn(() => time().toISOString()),
}))

export const devices = table('devices', (t) => ({
	id: t
		.text()
		.primaryKey()
		.$defaultFn(() => nanoid()),
	device_id: t.text().notNull(),
	createdAt: t.text().$defaultFn(() => time().toISOString()),
	lastUsedAt: t.text().$defaultFn(() => time().toISOString()),
}))

export const tokens = table(
	'tokens',
	(t) => ({
		id: t
			.text()
			.primaryKey()
			.$defaultFn(() => nanoid()),
		user_id: t
			.text()
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		device_id: t
			.text()
			.references(() => devices.id, { onDelete: 'cascade' })
			.notNull(),
		value: t.text().notNull(),
		createdAt: t.text().$defaultFn(() => time().toISOString()),
		updatedAt: t.text().$onUpdateFn(() => time().toISOString()),
	}),
	(t) => [uniqueIndex('tokens-user-device-index').on(t.user_id, t.device_id)],
)

export const sessions = table(
	'sessions',
	(t) => ({
		id: t
			.text()
			.primaryKey()
			.$defaultFn(() => nanoid()),
		user_id: t
			.text()
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		device_id: t
			.text()
			.references(() => devices.id, { onDelete: 'cascade' })
			.notNull(),
		createdAt: t.text().$defaultFn(() => time().toISOString()),
		lastUsedAt: t.text().$defaultFn(() => time().toISOString()),
	}),
	(t) => [uniqueIndex('sessions-user-device-index').on(t.user_id, t.device_id)],
)

export const usersRelations = relations(users, ({ many }) => ({
	tokens: many(tokens),
	sessions: many(sessions),
}))

export const devicesRelations = relations(devices, ({ many }) => ({
	sessions: many(sessions),
}))

export const tokensRelations = relations(tokens, ({ one }) => ({
	user: one(users, {
		fields: [tokens.user_id],
		references: [users.id],
		relationName: 'tokens-user',
	}),
	device: one(devices, {
		fields: [tokens.device_id],
		references: [devices.id],
		relationName: 'tokens-device',
	}),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.user_id],
		references: [users.id],
		relationName: 'sessions-user',
	}),
	device: one(devices, {
		fields: [sessions.device_id],
		references: [devices.id],
		relationName: 'sessions-device',
	}),
}))

export const schema = {
	users,
	devices,
	tokens,
	sessions,
	usersRelations,
	devicesRelations,
	tokensRelations,
	sessionsRelations,
}
