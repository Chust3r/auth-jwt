import { verify } from 'argon2'
import { Hono } from 'hono'
import { getUserById, updateUserPassword } from '~actions/users'
import { errorResponse, successResponse } from '~lib/response'
import { ChangePasswordSchema } from '~lib/validation'
import { getAuth } from '~middlwares/auth'

export const change = new Hono()

change.patch('/', getAuth, async (c) => {
	try {
		const body = await c.req.json()

		const { success, error, data } = ChangePasswordSchema.safeParse(body)

		if (!success) {
			return c.json(errorResponse(error.formErrors.fieldErrors), 400)
		}

		const { sub } = c.var.payload

		const user = await getUserById(sub)

		if (!user) {
			return c.json(errorResponse(null, 'User not found'), 404)
		}

		const isCorrectPassword = await verify(user.password, data.oldPassword)

		if (!isCorrectPassword) {
			return c.json(errorResponse(null, 'Old password is incorrect'), 400)
		}

		const isUpdated = await updateUserPassword(user.id, data.newPassword)

		if (!isUpdated) {
			return c.json(errorResponse(null, 'Something went wrong'), 500)
		}

		return c.json(successResponse(null), 200)
	} catch (e) {
		if (e instanceof Error) {
			console.error(e.message)
		} else {
			console.error('Unknown Error')
		}

		return c.json(errorResponse(null, 'Internal Server Error'), 500)
	}
})
