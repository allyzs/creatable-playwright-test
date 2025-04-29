import { test as base, expect } from '@playwright/test'
import { Login } from '../pages'

export const test = base.extend({
    login: async ({ page }, use) => {
		await use(new Login(page))
	}
})


export const slowExpect = expect.configure({ timeout: 50000 })