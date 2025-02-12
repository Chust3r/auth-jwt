import { Hono } from 'hono'
import { me } from './me'
import { refresh } from './refresh'
import { signIn } from './sign-in'
import { signOut } from './sign-out'
import { signUp } from './sign-up'
import { sessions } from './sessions'

export const auth = new Hono()

auth.route('/sign-up', signUp)
auth.route('/sign-in', signIn)
auth.route('/refresh', refresh)
auth.route('/sign-out', signOut)
auth.route('/me', me)
auth.route('/sessions', sessions)
