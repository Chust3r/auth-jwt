import { Hono } from 'hono'

export const signUp = new Hono()

signUp.get('/', (c) => {
	return new Response('Sign Up')
})
