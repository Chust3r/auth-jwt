import { createSigner } from 'fast-jwt'
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

export const createAccessToken = (userId: string) => {
	return accessSigner({
		sub: userId,
	})
}

export const createRefreshToken = (userId: string, deviceId: string) => {
	return refreshSigner({
		sub: userId,
		deviceId,
	})
}
