import { Hono } from 'hono'
import { getCookie, setCookie } from 'hono/cookie'
import { deleteToken, getToken } from '~actions/tokens'
import { errorResponse, successResponse } from '~lib/response'
import {
	createAccessToken,
	createRefreshToken,
	verifyRefreshToken,
} from '~lib/tokens'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

export const refresh = new Hono()

refresh.post('/', async (c) => {
	try {
		const refreshToken = getCookie(c, 'refresh_token')

		if (!refreshToken) {
			return c.json(errorResponse(null, "Refresh token doesn't exist"), 401)
		}

		const decoded = verifyRefreshToken(refreshToken)
		if (!decoded) {
			return c.json(errorResponse(null, "Refresh token isn't valid"), 403)
		}

		const storedToken = await getToken(refreshToken)
		if (!storedToken) {
			return c.json(errorResponse(null, 'Refresh token was revoked'), 403)
		}

		const payload = {
			sub: decoded.sub,
			device: decoded.device,
			session: decoded.session,
		}

		const expiresAt = dayjs.unix(decoded.exp)
		const currentTime = dayjs()
		const remainingTime = expiresAt.diff(currentTime, 'hours', true)

		let newRefreshToken = refreshToken

		if (remainingTime < 1) {
			newRefreshToken = createRefreshToken(payload)

			const deletedToken = await deleteToken(refreshToken, decoded.sub)
			if (!deletedToken) {
				return c.json(
					errorResponse(null, 'Error while revoking refresh token'),
					500
				)
			}

			setCookie(c, 'refresh_token', newRefreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: 'Strict',
			})
		}

		const accessToken = createAccessToken(payload)

		return c.json(successResponse({ access_token: accessToken }), 201)
	} catch (e) {
		console.error(e instanceof Error ? e.message : 'Unknown Error')
		return c.json(errorResponse(null, 'Internal Server Error'), 500)
	}
})
