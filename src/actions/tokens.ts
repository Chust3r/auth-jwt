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
				target: [tokens.userId, tokens.deviceId],
			})
			.returning({ value: tokens.value })

		return token[0].value
	} catch (e) {
		console.log(e)
		throw new Error('[ACTIONS:TOKENS:CREATE]')
	}
}

export const getToken = async (value: string) => {
	try {
		const token = await db.query.tokens.findFirst({
			where: (t, { eq }) => eq(t.value, value),
		})

		return token
	} catch (e) {
		console.log(e)
		throw new Error('[ACTIONS:TOKENS:CREATE]')
	}
}

export const deleteToken = async (value: string, userId: string) => {
	try {
		const token = await db
			.delete(tokens)
			.where(and(eq(tokens.value, value), eq(tokens.userId, userId)))

		return token
	} catch (e) {
		console.log(e)
		throw new Error('[ACTIONS:TOKENS:DELETE]')
	}
}
