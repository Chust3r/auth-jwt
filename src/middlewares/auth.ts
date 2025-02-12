import { createMiddleware } from 'hono/factory'
import { getDeviceById } from '~actions/devices'
import { getSessionById } from '~actions/sessions'
import { errorResponse } from '~lib/response'
import { verifyAccessToken } from '~lib/tokens'
import type { Payload } from '~types'

interface Context {
	Variables: {
		payload: Payload
	}
}

export const getAuth = createMiddleware<Context>(async (c, next) => {
	try {
		const device_id = c.req.header('X-Device-ID')

		const access_token = c.req.header('Authorization')?.replace('Bearer ', '')

		if (!device_id || !access_token) {
			return c.json(errorResponse(null, 'Unauthorized'), 401)
		}

		const isValid = verifyAccessToken(access_token)

		if (!isValid) {
			return c.json(errorResponse(null, 'Unauthorized'), 401)
		}

		const device = await getDeviceById(isValid.device)

		if (!device || device?.device_id !== device_id) {
			return c.json(errorResponse(null, 'Unauthorized'), 401)
		}

		const session = await getSessionById(isValid.session)

		if (!session) {
			return c.json(errorResponse(null, 'Unauthorized'), 401)
		}

		c.set('payload', isValid)

		await next()
	} catch (e) {
		if (e instanceof Error) {
			console.error(e.message)
		} else {
			console.error('Unknown Error')
		}

		return c.json(errorResponse(null, 'Internal Server Error'), 500)
	}
})
