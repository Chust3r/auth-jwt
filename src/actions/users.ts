import { hash } from 'argon2'
import { db } from '~db'
import { users } from '~lib/schema'
import type { User } from '~types'

export const getUserByEmail = async (email: string) => {
	try {
		return await db.query.users.findFirst({
			where: (u, { eq }) => eq(u.email, email),
		})
	} catch (e) {
		throw new Error('[ACTIONS:USERS:GET_BY_EMAIL]')
	}
}

export const createUser = async (data: User) => {
	try {
		const password = await hash(data.password)

		const user = await db
			.insert(users)
			.values({
				email: data.email,
				password,
			})
			.returning({
				id: users.id,
				email: users.email,
				createdAt: users.createdAt,
			})

		return user[0]
	} catch (e) {
		throw new Error('[ACTIONS:USERS:GET_BY_EMAIL]')
	}
}
