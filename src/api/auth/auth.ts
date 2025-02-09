import { Hono } from 'hono'
import { refresh } from './refresh'
import { signIn } from './sign-in'
import { signUp } from './sign-up'
import { signOut } from './sign-out'

export const auth = new Hono()

auth.route('/sign-up', signUp)
auth.route('/sign-in', signIn)
auth.route('/refresh', refresh)
auth.route('/sign-out', signOut)
