import type { Device } from '~types'
import { db } from '~db'
import { devices } from '~lib/schema'

export const createDevice = async (data: Device) => {
	try {
		const device = await db
			.insert(devices)
			.values(data)
			.returning({ deviceId: devices.deviceId, id: devices.id })

		return device[0]
	} catch (e) {
		throw new Error('[ACTIONS:DEVICES:CREATE]')
	}
}
