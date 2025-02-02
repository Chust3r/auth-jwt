import type { ErrorResponse, SuccessResponse } from '~types'

export const errorResponse = (
	errors: Record<string, unknown> | null = null,
	error = 'Invalid Request',
): ErrorResponse => ({
	error,
	success: false,
	errors,
})

export const successResponse = <T>(data: T): SuccessResponse<T> => ({
	error: null,
	success: true,
	data,
})
