import { eq } from 'drizzle-orm'
import { db } from '~db'
import { devices } from '~lib/schema'
import type { Device } from '~types'

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

//→ MUST BE GET OR CREATE DEVICE BY USER ID, IF EXIST THEN RETURN BUT UPDATE LAST USED

export const getOrCreateDeviceByUserId = async (
	userId: string,
	deviceId: string,
) => {
	try {
		const device = await db.query.devices.findFirst({
			where: (d, { eq, and }) =>
				and(eq(d.userId, userId), eq(d.deviceId, deviceId)),
		})

		if (device) {
			const updatedDevice = await db
				.update(devices)
				.set({
					lastUsedAt: new Date().toISOString(),
				})
				.where(eq(devices.id, device.id))
				.returning({ deviceId: devices.deviceId, id: devices.id })

			return updatedDevice[0]
		}

		const newDevice = await createDevice({
			userId,
			deviceId,
		})

		return newDevice
	} catch (e) {
		throw new Error('[ACTIONS:DEVICES:GET_OR_CREATE_BY_USER_ID]')
	}
}
