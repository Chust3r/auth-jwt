import { Hono } from 'hono'
import { setCookie } from 'hono/cookie'
import { createToken } from '~actions/tokens'
import { createUser, getUserByEmail } from '~actions/users'
import { errorResponse, successResponse } from '~lib/response'
import { createAccessToken, createRefreshToken } from '~lib/tokens'
import { SignUpSchema } from '~lib/validation'

export const signUp = new Hono()

signUp.post('/', async (c) => {
	try {
		const body = await c.req.json()

		const { success, error, data } = SignUpSchema.safeParse(body)

		if (!success) {
			return c.json(errorResponse(error.formErrors.fieldErrors), 400)
		}

		const exists = await getUserByEmail(data.email)

		if (exists) return c.json(errorResponse(null, 'Email already exists'), 400)

		const user = await createUser(data)

		const acccessToken = createAccessToken(user.id)

		const refreshToken = createRefreshToken(user.id, user.device.deviceId)

		const token = await createToken({
			userId: user.id,
			deviceId: user.device.id,
			refreshToken,
		})

		setCookie(c, 'refresh_token', token, {
			httpOnly: true,
			sameSite: 'Lax',
			secure: true,
		})

		return c.json(successResponse({ acccess_token: acccessToken }), 201)
	} catch (e) {
		if (e instanceof Error) {
			console.error(e.message)
		} else {
			console.error('Unknown Error')
		}

		return c.json(errorResponse(null, 'Internal Server Error'), 500)
	}
})
