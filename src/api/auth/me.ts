import { Hono } from 'hono'
import { getUserInfo } from '~actions/users'
import { errorResponse, successResponse } from '~lib/response'
import { verifyAccessToken } from '~lib/tokens'

export const me = new Hono()

me.get('/', async (c) => {
	try {
		const authHeader = c.req.header('Authorization')

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return c.json(errorResponse(null, 'Unauthorized'), 401)
		}

		const access_token = authHeader.slice(7).trim()
		const decoded = verifyAccessToken(access_token)

		if (!decoded) {
			return c.json(errorResponse(null, 'Invalid token'), 403)
		}

		const info = await getUserInfo(decoded.sub, decoded.session)

		if (!info) {
			return c.json(errorResponse(null, 'User info not found'), 404)
		}

		return c.json(successResponse(info), 200)
	} catch (e) {
		console.error(e instanceof Error ? e.message : 'Unknown Error')
		return c.json(errorResponse(null, 'Internal Server Error'), 500)
	}
})
