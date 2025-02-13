import dayjs from 'dayjs'
import { and, eq } from 'drizzle-orm'
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

export const deleteSession = async (user_id: string, device_id: string) => {
	try {
		const session = await db
			.delete(sessions)
			.where(
				and(eq(sessions.user_id, user_id), eq(sessions.device_id, device_id)),
			)

		return session
	} catch (e) {
		console.log(e)
		throw new Error('[ACTIONS:SESSIONS:DELETE]')
	}
}

export const getSessionById = async (session_id: string) => {
	try {
		const session = await db.query.sessions.findFirst({
			where: (s, { eq }) => eq(s.id, session_id),
		})

		return session
	} catch (e) {
		console.log(e)
		throw new Error('[ACTIONS:SESSIONS:GET_SESSION_BY_ID]')
	}
}

export const getSessions = async (user_id: string) => {
	try {
		const sessions = await db.query.sessions.findMany({
			where: (s, { eq }) => eq(s.user_id, user_id),
			orderBy: (s, { desc }) => desc(s.lastUsedAt),
		})

		return sessions
	} catch (e) {
		console.log(e)
		throw new Error('[ACTIONS:SESSIONS:GET_SESSIONS]')
	}
}

export const getSession = async (session_id: string, user_id: string) => {
	const session = await db.query.sessions.findFirst({
		where: (s, { eq, and }) =>
			and(eq(s.id, session_id), eq(s.user_id, user_id)),
	})

	return session
}
