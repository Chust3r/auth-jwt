import { deleteSession, getSession } from './sessions'
import { deleteToken } from './tokens'

export const revokeUserSession = async (
	session_id: string,
	user_id: string
) => {
	try {
		const session = await getSession(session_id, user_id)

		if (!session) return false

		const { device_id } = session

		const [isRevoked, isDeleted] = await Promise.all([
			deleteToken(user_id, device_id),
			deleteSession(user_id, device_id),
		])

		return isRevoked && isDeleted
	} catch (e) {
		console.log(e)
		throw new Error('[ACTIONS:AUTH:REVOKE_SESSION]')
	}
}
