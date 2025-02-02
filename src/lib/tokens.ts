import { createSigner } from 'fast-jwt'
import type { Payload } from '~types'
import { env } from './consts'

const accessSigner = createSigner({
	algorithm: 'HS256',
	key: env.JWT_SECRET,
	expiresIn: env.JWT_EXPIRES_IN,
})

const refreshSigner = createSigner({
	algorithm: 'HS256',
	key: env.REFRESH_SECRET,
	expiresIn: env.REFRESH_EXPIRES_IN,
})

export const createAccessToken = (payload: Payload) => {
	return accessSigner(payload)
}

export const createRefreshToken = (payload: Payload) => {
	return refreshSigner(payload)
}
