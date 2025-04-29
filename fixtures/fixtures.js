import { test as base, expect } from '@playwright/test'
import { Login, Navigation, Content } from '../pages'

export const test = base.extend({
    login: async ({ page }, use) => {
		await use(new Login(page))
	},
    navigation: async ({page}, use)=> {
        await use(new Navigation(page))
    },
    content: async ({page}, use)=> {
        await use(new Content(page))
    }
})


export const slowExpect = expect.configure({ timeout: 50000 })