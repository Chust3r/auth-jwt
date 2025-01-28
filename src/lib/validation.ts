import { z } from 'zod'

export const SignUpSchema = z.object({
	email: z.string().email('Email is not valid'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
	deviceId: z.string(),
})
