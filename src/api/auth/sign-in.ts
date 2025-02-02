import { verify } from 'argon2'
import { Hono } from 'hono'
import { setCookie } from 'hono/cookie'
import { getOrCreateDeviceByUserId } from '~actions/devices'
import { createToken } from '~actions/tokens'
import { getUserByEmail } from '~actions/users'
import { errorResponse, successResponse } from '~lib/response'
import { createAccessToken, createRefreshToken } from '~lib/tokens'
import { SignInSchema } from '~lib/validation'

export const signIn = new Hono()

signIn.post('/', async (c) => {
	try {
		const body = await c.req.json()

		const { success, data, error } = SignInSchema.safeParse(body)

		if (!success) {
			return c.json(errorResponse(error.formErrors.fieldErrors), 400)
		}

		const user = await getUserByEmail(data.email)

		if (!user) {
			return c.json(errorResponse(null, 'Unauthorized'), 404)
		}

		const isCorrectPassword = await verify(user.password, data.password)

		if (!isCorrectPassword) {
			return c.json(errorResponse(null, 'Unauthorized'), 404)
		}

		const device = await getOrCreateDeviceByUserId(user.id, data.deviceId)

		const acccessToken = createAccessToken(user.id)

		const refreshToken = createRefreshToken(user.id, device.deviceId)

		const token = await createToken({
			userId: user.id,
			deviceId: device.id,
			refreshToken,
		})

		setCookie(c, 'refresh_token', token, {
			httpOnly: true,
			sameSite: 'Lax',
			secure: true,
		})

		return c.json(successResponse({ acccess_token: acccessToken }), 200)
	} catch (e) {
		if (e instanceof Error) {
			console.error(e.message)
		} else {
			console.error('Unknown Error')
		}

		return c.json(errorResponse(null, 'Internal Server Error'), 500)
	}
})
