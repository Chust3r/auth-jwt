import dayjs from 'dayjs'
import { relations } from 'drizzle-orm'
import {
	index,
	sqliteTable as table,
	uniqueIndex,
} from 'drizzle-orm/sqlite-core'
import { nanoid } from 'nanoid'

export const users = table('users', (t) => ({
	id: t
		.text()
		.primaryKey()
		.$defaultFn(() => nanoid()),
	email: t.text().unique().notNull(),
	password: t.text().notNull(),
	createdAt: t.text().$defaultFn(() => dayjs().toISOString()),
	updatedAt: t.text().$onUpdateFn(() => dayjs().toISOString()),
}))

export const devices = table('devices', (t) => ({
	id: t
		.text()
		.primaryKey()
		.$defaultFn(() => nanoid()),
	deviceId: t.text().notNull(),
	createdAt: t.text().$defaultFn(() => dayjs().toISOString()),
	lastUsedAt: t.text().$defaultFn(() => dayjs().toISOString()),
}))

export const tokens = table(
	'tokens',
	(t) => ({
		id: t
			.text()
			.primaryKey()
			.$defaultFn(() => nanoid()),
		userId: t
			.text()
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		deviceId: t
			.text()
			.references(() => devices.id, { onDelete: 'cascade' })
			.notNull(),
		value: t.text().notNull(),
		createdAt: t.text().$defaultFn(() => dayjs().toISOString()),
		updatedAt: t.text().$onUpdateFn(() => dayjs().toISOString()),
	}),
	(t) => [uniqueIndex('tokens-user-device-index').on(t.userId, t.deviceId)],
)

export const sessions = table(
	'sessions',
	(t) => ({
		id: t
			.text()
			.primaryKey()
			.$defaultFn(() => nanoid()),
		userId: t
			.text()
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		deviceId: t
			.text()
			.references(() => devices.id, { onDelete: 'cascade' })
			.notNull(),
		createdAt: t.text().$defaultFn(() => dayjs().toISOString()),
		lastUsedAt: t.text().$defaultFn(() => dayjs().toISOString()),
	}),
	(t) => [uniqueIndex('sessions-user-device-index').on(t.userId, t.deviceId)],
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
		fields: [tokens.userId],
		references: [users.id],
		relationName: 'tokens-user',
	}),
	device: one(devices, {
		fields: [tokens.deviceId],
		references: [devices.id],
		relationName: 'tokens-device',
	}),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
		relationName: 'sessions-user',
	}),
	device: one(devices, {
		fields: [sessions.deviceId],
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
