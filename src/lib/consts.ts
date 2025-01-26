import 'dotenv/config'

const { DB_URL } = process.env

export const env = {
	DB_URL: DB_URL ?? 'file:./db.sqlite',
}
