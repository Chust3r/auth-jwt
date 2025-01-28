import type { InferInsertModel } from 'drizzle-orm'
import type { devices, users } from '~lib/schema'

export interface ErrorResponse {
	error: string
	success: false
	errors: Record<string, unknown> | null
}

export interface SuccessResponse<T> {
	error: null
	success: true
	data: T
}

export type User = InferInsertModel<typeof users>

export type UserWithDeviceId = User & { deviceId: string }

export type Device = InferInsertModel<typeof devices>
