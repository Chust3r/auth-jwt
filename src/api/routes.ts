import { Hono } from 'hono'
import { signIn } from './auth/sign-in'
import { signUp } from './auth/sign-up'
import { refresh } from './auth/refresh'

export const api = new Hono().basePath('/api')

api.route('/auth/sign-up', signUp)
api.route('/auth/sign-in', signIn)
api.route("/auth/refresh", refresh)
