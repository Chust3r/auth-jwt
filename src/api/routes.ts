import { Hono } from 'hono'
import { auth } from './auth/auth'

export const api = new Hono().basePath('/api')

api.route('/auth', auth)
