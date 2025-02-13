import dayjs from 'dayjs'
import { and, eq } from 'drizzle-orm'
import { db } from '~db'
import { tokens } from '~lib/schema'
import type { Token } from '~types'

export const createToken = async (data: Token) => {
	try {
		const token = await db
			.insert(tokens)
			.values(data)
			.onConflictDoUpdate({
				set: {
					updatedAt: dayjs().format(),
				},
				target: [tokens.user_id, tokens.device_id],
			})
			.returning({ value: tokens.value })

		return token[0].value
	} catch (e) {
		console.log(e)
		throw new Error('[ACTIONS:TOKENS:CREATE]')
	}
}

export const getToken = async (value: string, device_id: string) => {
	try {
		const token = await db.query.tokens.findFirst({
			where: (t, { eq, and }) =>
				and(eq(t.value, value), eq(t.device_id, device_id)),
		})

		return token
	} catch (e) {
		console.log(e)
		throw new Error('[ACTIONS:TOKENS:CREATE]')
	}
}

export const revokeToken = async (value: string, user_id: string) => {
	try {
		const token = await db
			.delete(tokens)
			.where(and(eq(tokens.value, value), eq(tokens.user_id, user_id)))

		return token
	} catch (e) {
		console.log(e)
		throw new Error('[ACTIONS:TOKENS:DELETE]')
	}
}

export const deleteToken = async (user_id: string, device_id: string) => {
	try {
		const token = await db
			.delete(tokens)
			.where(
				and(eq(tokens.user_id, user_id), eq(tokens.device_id, device_id))
			)

		return token
	} catch (e) {
		console.log(e)
		throw new Error('[ACTIONS:TOKENS:DELETE]')
	}
}
