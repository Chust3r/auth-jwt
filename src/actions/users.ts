import { hash } from 'argon2'
import { eq } from 'drizzle-orm'
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

export const getUserById = async (user_id: string) => {
	try {
		return await db.query.users.findFirst({
			where: (u, { eq }) => eq(u.id, user_id),
		})
	} catch (e) {
		throw new Error('[ACTIONS:USERS:GET_USER_BY_ID]')
	}
}

export const updateUserPassword = async (user_id: string, newPass: string) => {
	try {
		const password = await hash(newPass)

		const isUpdated = await db
			.update(users)
			.set({
				password,
			})
			.where(eq(users.id, user_id))

		return isUpdated
	} catch (e) {
		throw new Error('[ACTIONS:USERS:UPDATE_USER:PASSWORD]')
	}
}
