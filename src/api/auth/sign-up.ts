import { Hono } from 'hono'
import { setCookie } from 'hono/cookie'
import { getOrCreateDevice } from '~actions/devices'
import { getOrCreateSession } from '~actions/sessions'
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

		const device = await getOrCreateDevice(data.deviceId)

		const session = await getOrCreateSession(user.id, device.id)

		const payload = {
			sub: user.id,
			device: device.id,
			session: session.id,
		}

		const acccessToken = createAccessToken(payload)

		const refreshToken = createRefreshToken(payload)

		const token = await createToken({
			user_id: user.id,
			device_id: device.id,
			value: refreshToken,
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
