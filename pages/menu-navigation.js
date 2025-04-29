import { test, slowExpect } from '../fixtures/fixtures'

class Navigation {
    constructor (page) {
        this.page = page
        this.sidebarMenuBtn = '//button[@id="menu"]'
        this.contentMenuOption = '//a[contains(@href,"content")]'
    }

    async openSidebarMenu() {
        await test.step('Open Sidebar Menu', async () => {
            await this.page.locator(this.sidebarMenuBtn).click()
        })
    }

    async chooseMenuOption(option) {
        await test.step(`Click ${option} menu option`, async () => {
            switch (option) {
                case 'Content':
                    await this.page.locator(this.contentMenuOption).click()
                    break
            }
        })
    }

    async navigateToMenuPage(option) {
        await test.step(`Navigate to ${option} Page`, async () => {
            await this.openSidebarMenu()
            await this.chooseMenuOption(option)
        })
    }
}

module.exports = Navigation