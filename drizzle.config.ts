import { defineConfig } from 'drizzle-kit'
import { env } from 'src/lib/consts'

export default defineConfig({
	dialect: 'sqlite',
	schema: './src/lib/schema.ts',
	out: './drizzle',
	dbCredentials: {
		url: env.DB_URL,
	},
})
