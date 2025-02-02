import dayjs from 'dayjs'
import { db } from '~db'
import { sessions } from '~lib/schema'

export const getOrCreateSession = async (userId: string, deviceId: string) => {
	try {
		const session = await db
			.insert(sessions)
			.values({
				userId,
				deviceId,
			})
			.onConflictDoUpdate({
				set: {
					lastUsedAt: dayjs().format(),
				},
				target: [sessions.userId, sessions.deviceId],
			})
			.returning()

		return session[0]
	} catch (e) {
		console.log(e)
		throw new Error('[ACTIONS:SESSIONS:CREATE]')
	}
}
