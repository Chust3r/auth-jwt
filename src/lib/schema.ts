import { relations } from 'drizzle-orm'
import { sqliteTable as table } from 'drizzle-orm/sqlite-core'
import { nanoid } from 'nanoid'

export const users = table('users', (t) => ({
	id: t
		.text()
		.primaryKey()
		.$defaultFn(() => nanoid()),
	email: t.text().unique().notNull(),
	password: t.text().notNull(),
	createdAt: t.text().$defaultFn(() => new Date().toISOString()),
	updatedAt: t.text().$onUpdateFn(() => new Date().toISOString()),
}))

export const devices = table('devices', (t) => ({
	id: t
		.text()
		.primaryKey()
		.$defaultFn(() => nanoid()),
	userId: t
		.text()
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull(),
	deviceId: t.text().notNull(),
	createdAt: t.text().$defaultFn(() => new Date().toISOString()),
	lastUsedAt: t.text().$defaultFn(() => new Date().toISOString()),
}))

export const tokens = table('tokens', (t) => ({
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
	refreshToken: t.text().notNull(),
	createdAt: t.text().$defaultFn(() => new Date().toISOString()),
	expiresAt: t.text().notNull(),
}))

export const usersRelations = relations(users, ({ many }) => ({
	devices: many(devices),
}))

export const devicesRelations = relations(devices, ({ one }) => ({
	user: one(users, {
		fields: [devices.userId],
		references: [users.id],
		relationName: 'devices-user',
	}),
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

export const schema = {
	users,
	devices,
	tokens,
	usersRelations,
	devicesRelations,
	tokensRelations,
}
