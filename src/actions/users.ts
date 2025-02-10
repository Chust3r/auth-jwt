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

export const getUserInfo = async (id: string, session: string) => {
	try {
		const user = await db.query.users.findFirst({
			where: (u, { eq }) => eq(u.id, id),
			with: {
				sessions: {
					where: (s, { eq }) => eq(s.id, session),
					with: {
						device: true,
					},
				},
			},
		})

		const data = {
			user: {
				email: user?.email,
				createdAt: user?.createdAt,
			},
			device: {
				device_id: user?.sessions[0]?.device?.device_id,
				createdAt: user?.sessions[0]?.device?.createdAt,
				lastUsedAt: user?.sessions[0]?.device?.lastUsedAt,
			},
			session: {
				id: user?.sessions[0]?.id,
				createdAt: user?.sessions[0]?.createdAt,
				lastUsedAt: user?.sessions[0]?.lastUsedAt,
			},
		}

		return data
	} catch (e) {
		throw new Error('[ACTIONS:USERS:GET_USER_INFO_BY_ID]')
	}
}
