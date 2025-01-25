import { Hono } from 'hono'

export const signIn = new Hono()

signIn.get('/', (c) => {
	return new Response('Sign In')
})
