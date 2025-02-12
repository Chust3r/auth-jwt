import { Hono } from 'hono'
import { getSessions } from '~actions/sessions'
import { errorResponse, successResponse } from '~lib/response'
import { getAuth } from '~middlwares/auth'

export const sessions = new Hono()

sessions.get('/', getAuth, async (c) => {
	try {
		const { sub } = c.var.payload

		const sessions = await getSessions(sub)

		return c.json(successResponse(sessions), 200)
	} catch (e) {
		if (e instanceof Error) {
			console.error(e.message)
		} else {
			console.error('Unknown Error')
		}

		return c.json(errorResponse(null, 'Internal Server Error'), 500)
	}
})
