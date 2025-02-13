import { Hono } from 'hono'
import { revokeUserSession } from '~actions/auth'
import { getSessionById } from '~actions/sessions'
import { errorResponse, successResponse } from '~lib/response'
import { getAuth } from '~middlwares/auth'

export const revoke = new Hono()

revoke.delete('/:session_id', getAuth, async (c) => {
	try {
		const session_id = c.req.param('session_id')

		if (!session_id) {
			return c.json(errorResponse(null, 'Invalid session id'), 400)
		}

		const session = await getSessionById(session_id)

		if (!session || session.user_id !== c.var.payload.sub) {
			return c.json(errorResponse(null, 'Session not found'), 404)
		}

		const { sub } = c.var.payload

		const isRevoked = await revokeUserSession(session_id, sub)

		if (!isRevoked) {
			return c.json(errorResponse(null, 'Something went wrong'), 500)
		}

		return c.json(
			successResponse({ message: 'Session revoked successfully' }),
			200
		)
	} catch (e) {
		if (e instanceof Error) {
			console.error(e.message)
		} else {
			console.error('Unknown Error')
		}

		return c.json(errorResponse(null, 'Internal Server Error'), 500)
	}
})
