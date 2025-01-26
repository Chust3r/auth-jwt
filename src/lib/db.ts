import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import { schema } from './schema'
import { env } from './consts'

const client = createClient({ url: env.DB_URL })

export const db = drizzle({ client, schema })
