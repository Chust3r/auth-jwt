import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { api } from '~api'

const app = new Hono()

app.use(logger())

app.route('/', api)

export default app
