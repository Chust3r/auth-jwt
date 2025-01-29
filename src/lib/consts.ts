import 'dotenv/config'

const { DB_URL, JWT_SECRET, REFRESH_SECRET,JWT_EXPIRES_IN, REFRESH_EXPIRES_IN } = process.env

export const env = {
	DB_URL: DB_URL ?? 'file:./db.sqlite',
	JWT_SECRET: JWT_SECRET ?? 'secret',
	REFRESH_SECRET: REFRESH_SECRET ?? 'refresh',
	JWT_EXPIRES_IN: JWT_EXPIRES_IN ?? '1h',
	REFRESH_EXPIRES_IN: REFRESH_EXPIRES_IN ?? '30d',
}
