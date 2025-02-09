import dayjs from 'dayjs'
import { db } from '~db'
import { sessions } from '~lib/schema'

export const getOrCreateSession = async (
	user_id: string,
	device_id: string,
) => {
	try {
		const session = await db
			.insert(sessions)
			.values({
				user_id,
				device_id,
			})
			.onConflictDoUpdate({
				set: {
					lastUsedAt: dayjs().format(),
				},
				target: [sessions.user_id, sessions.device_id],
			})
			.returning()

		return session[0]
	} catch (e) {
		console.log(e)
		throw new Error('[ACTIONS:SESSIONS:CREATE]')
	}
}
