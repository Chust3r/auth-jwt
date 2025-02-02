import { db } from '~db'
import { tokens } from '~lib/schema'
import type { Token } from '~types'

export const createToken = async (data: Token) => {
	try {
		const token = await db
			.insert(tokens)
			.values(data)
			.returning({ id: tokens.refreshToken })

		return token[0].id
	} catch (e) {
		console.log(e)
		throw new Error('[ACTIONS:TOKENS:CREATE]')
	}
}
