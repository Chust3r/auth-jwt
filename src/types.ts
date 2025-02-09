import type { InferInsertModel } from 'drizzle-orm'
import type { devices, tokens, users } from '~lib/schema'

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

export interface Payload {
	sub: string
	device: string
	session: string
}

export interface VerifyPayload extends Payload {
	iat: number
	exp: number
}

export type User = InferInsertModel<typeof users>

export type Device = InferInsertModel<typeof devices>

export type Token = InferInsertModel<typeof tokens>
