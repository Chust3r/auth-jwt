import { sqliteTable as table } from 'drizzle-orm/sqlite-core'

export const users = table('users', (t) => ({
	id: t.integer().primaryKey({ autoIncrement: true }),
}))

export const schema = {
	users,
}
