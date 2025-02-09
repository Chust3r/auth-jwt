import dayjs from 'dayjs'
import { eq } from 'drizzle-orm'
import { db } from '~db'
import { devices } from '~lib/schema'
import type { Device } from '~types'

export const createDevice = async (data: Device) => {
	try {
		const device = await db
			.insert(devices)
			.values(data)
			.returning({ device_id: devices.device_id, id: devices.id })

		return device[0]
	} catch (e) {
		throw new Error('[ACTIONS:DEVICES:CREATE]')
	}
}

export const getOrCreateDevice = async (device_id: string) => {
	try {
		const device = await db.query.devices.findFirst({
			where: (d, { eq }) => eq(d.device_id, device_id),
		})

		if (device) {
			const updatedDevice = await db
				.update(devices)
				.set({
					lastUsedAt: dayjs().format(),
				})
				.where(eq(devices.id, device.id))
				.returning({ device_id: devices.device_id, id: devices.id })

			return updatedDevice[0]
		}

		const newDevice = await createDevice({
			device_id,
		})

		return newDevice
	} catch (e) {
		throw new Error('[ACTIONS:DEVICES:GET_OR_CREATE_BY_USER_ID]')
	}
}
