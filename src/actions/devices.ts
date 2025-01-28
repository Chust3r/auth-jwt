import type { Device } from '~types'
import { db } from '~db'
import { devices } from '~lib/schema'

export const createDevice = async (data: Device) => {
	try {
		const device = await db.insert(devices).values(data).returning()

		return device
	} catch (e) {
		throw new Error('[ACTIONS:DEVICES:CREATE]')
	}
}
