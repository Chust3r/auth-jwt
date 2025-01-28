import { Hono } from 'hono'
import { createUser, getUserByEmail } from '~actions/users'
import { errorResponse, successResponse } from '~lib/response'
import { SignUpSchema } from '~lib/validation'

export const signUp = new Hono()

signUp.post('/', async (c) => {
	try {
		const body = await c.req.json()

		const { success, error, data } = SignUpSchema.safeParse(body)

		if (!success) {
			return c.json(errorResponse(error.formErrors.fieldErrors), 400)
		}

		const user = await getUserByEmail(data.email)

		if (user) return c.json(errorResponse(null, 'Email already exists'), 400)

		const newUser = await createUser(data)

		return c.json(successResponse(newUser), 201)
	} catch (e) {
		if (e instanceof Error) {
			console.error(e.message)
		} else {
			console.error('Unknown Error')
		}

		return c.json(errorResponse(null, 'Internal Server Error'), 500)
	}
})
