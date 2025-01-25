import { Hono } from 'hono'
import { signUp } from './auth/sign-up'
import { signIn } from './auth/sign-in'

export const api = new Hono().basePath('/api')

api.route('/auth/sign-up', signUp)
api.route('/auth/sign-in', signIn)
