import { Hono } from 'hono'
import { getUserInfo } from '~actions/users'
import { errorResponse, successResponse } from '~lib/response'
import { getAuth } from '~middlwares/auth'

export const me = new Hono()

me.get('/', getAuth, async (c) => {
	try {
		const { session, sub } = c.var.payload

		const info = await getUserInfo(sub, session)

		if (!info) {
			return c.json(errorResponse(null, 'User info not found'), 404)
		}

		return c.json(successResponse(info), 200)
	} catch (e) {
		console.error(e instanceof Error ? e.message : 'Unknown Error')
		return c.json(errorResponse(null, 'Internal Server Error'), 500)
	}
})
