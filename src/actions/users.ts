import type { UserWithDeviceId } from '~types'
import { db } from '~db'
import { users } from '~lib/schema'
import { hash } from 'argon2'
import { createDevice } from './devices'

export const getUserByEmail = async (email: string) => {
	try {
		return await db.query.users.findFirst({
			where: (u, { eq }) => eq(u.email, email),
		})
	} catch (e) {
		throw new Error('[ACTIONS:USERS:GET_BY_EMAIL]')
	}
}

export const createUser = async (data: UserWithDeviceId) => {
	try {
		const user = await db
			.insert(users)
			.values({
				email: data.email,
				password: await hash(data.password),
			})
			.returning({
				id: users.id,
				email: users.email,
				createdAt: users.createdAt,
			})

		const device = await createDevice({
			userId: user[0].id,
			deviceId: data.deviceId,
		})

		return { ...user[0], device }
	} catch (e) {
		throw new Error('[ACTIONS:USERS:GET_BY_EMAIL]')
	}
}
