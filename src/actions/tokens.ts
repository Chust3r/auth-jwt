import dayjs from 'dayjs'
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
