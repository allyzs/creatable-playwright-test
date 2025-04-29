import { test, expect, slowExpect } from '../fixtures/fixtures'

class Login {
    constructor (page) {
        this.page = page
        this.emailFld = '//label[text()="Email"]/following-sibling::*/input'
        this.nextBtn = '//button/*[text()="Next"]'
        this.passwordFld = '//label[text()="Enter your password"]/following-sibling::*/input'
    }

    async openCreatable() {
        await test.step('Navigate to Creatable Website', async () => {
            await this.page.goto(process.env.URL)
            await this.page.waitForLoadState('domcontentloaded')
        })
    }

    async enterEmail() {
        await test.step('Enter Email', async () => {
            await this.page.locator(this.emailFld).fill(process.env.EMAIL)
        })
    }

    async enterPassword() {
        await test.step('Enter Passwrod', async () => {
            await this.page.locator(this.passwordFld).fill(process.env.PASSWORD)
        })
    }

    async clickNextBtn() {
        await test.step('Click Next button', async () => {
            await this.page.locator(this.nextBtn).click()
        })
    }

    async validateThatUserIsLoggedIn() {
        await test.step('Validate that user is logged in', async () => {
            await slowExpect(this.page).toHaveURL(/campaigns/)
        })  
    }

    async doFullLogin() {
        await this.openCreatable()
        await this.enterEmail()
        await this.clickNextBtn()
        await this.enterPassword()
        await this.clickNextBtn()
        await this.validateThatUserIsLoggedIn()
    }
}

module.exports = Login