import { Hono } from 'hono'
import { getCookie, setCookie } from 'hono/cookie'
import { revokeUserSession } from '~actions/auth'
import { errorResponse, successResponse } from '~lib/response'
import { verifyRefreshToken } from '~lib/tokens'
import { getAuth } from '~middlwares/auth'

export const signOut = new Hono()

signOut.post('/', getAuth, async (c) => {
	try {
		const refreshToken = getCookie(c, 'refresh_token')

		if (!refreshToken) {
			return c.json(errorResponse(null, 'No active session'), 401)
		}

		const isValid = verifyRefreshToken(refreshToken)

		if (!isValid) {
			return c.json(errorResponse(null, 'Invalid refresh token'), 401)
		}

		const isRevoked = await revokeUserSession(isValid.session, isValid.sub)

		if (!isRevoked) {
			return c.json(errorResponse(null, 'Something went wrong'), 500)
		}

		setCookie(c, 'refresh_token', '', {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: 0,
		})

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
