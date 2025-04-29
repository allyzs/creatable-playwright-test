import { test, slowExpect } from '../fixtures/fixtures'

class Content {
    constructor (page) {
        this.page = page
        this.pageTitle = '//h1'
        this.searchFld = '//input[@placeholder="Search"]'
        this.closeBtn = '//button/*[@data-testid="CloseIcon"]'
        //Content Card Elements
        this.contentCard = '//*[contains(@data-testid,"content")]'
        this.matchedProductTag = '//button/*[@data-testid="LocalOfferIcon"]/following-sibling::p'
        this.playIcon = '//*[@data-testid="PlayCircleOutlineIcon"]'
        //Should have proper test ids
        this.contentTitle = '//*[contains(@class,"css-keq24x")]'
        this.createDateDetail = '//*[contains(@class,"css-18mxlo4")]'
        this.statusDetail = '//*[contains(@class,"css-1pjtbja")]'
        // this.descriptionDetail = '//*[contains(@class,"css-ut0bns")]' - it is not description

        this.noContentMsg = '//*[text()="You have no content to display."]'

        this.createContentBtn = '//button[@aria-label="Content creation"]'
        this.createVideBtn = '//button[@aria-label="Video"]'
        this.createPhotoBtn = '//button[@aria-label="Photo"]'

        this.newVideoDialog = '//*[text()="Video upload"]'
        this.newPhotoDialog = '//*[text()="New photo post"]'
    }

    async validateThatURLIsCorrect() {
        await test.step('Validate that URL is correct', async () => {
            await slowExpect(this.page).toHaveURL(/content/)
        })  
    }

    async validateThatTitleIsCorrect() {
        await test.step('Validate that Page Title is correct', async () => {
            await slowExpect(await this.page.locator(this.pageTitle)).toContainText('Content')
        })  
    }

    async getContentList() {
        let responseResult
        await test.step('Get the content list from the endpoint', async () => {
            const response = this.page.waitForResponse(resp => resp.url().includes('content/list') && resp.status() === 200)
            responseResult = await response
        })
        return await responseResult.json()
    }

    async validateThatContentPageIsDisplayed() {
        await test.step('Validate that Content Page is Displayed', async () => {
            await this.validateThatURLIsCorrect()
            await this.validateThatTitleIsCorrect()
        })  
    }

    async validateThatNumberOfDisplayedContentIsCorrect(count) {
        await test.step('Validate that number of dipslayed content card is correct', async () => {
            await slowExpect(await this.page.locator(this.contentCard)).toHaveCount(count)
        })
    }

    async validateThatEachContentCardHasAllNecessaryDetailsDisplayed() {
        await test.step('Validate that each Content Card has all the necessary or required details displayed', async () => {
            const allContentCards = await this.page.locator(this.contentCard).all()
            for (const card of allContentCards) {
                await slowExpect(await card.locator(this.contentTitle)).toBeVisible()
                await slowExpect(await card.locator(this.createDateDetail)).toBeVisible()
                await slowExpect(await card.locator(this.statusDetail)).toBeVisible()
                // await slowExpect(await card.locator(this.descriptionDetail)).toBeVisible()
                await slowExpect(await card.locator(this.matchedProductTag)).toBeVisible()
            }
        })
    }

    async convertEpochDateToFormattedDate(epochDate) {
        const utcSeconds = epochDate;
        const d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        const date = d.setUTCSeconds(utcSeconds)   

        const dateFormatted = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }).format(date);

        return dateFormatted
    }


    async getDetailsOfDisplayedContentCards() {
        const allContentCards = await this.page.locator(this.contentCard).all()
        let contentCardDetails = []
        for (const card of allContentCards) {
            contentCardDetails.push({
                title: await card.locator(this.contentTitle).innerText(),
                createDate: await card.locator(this.createDateDetail).innerText(),
                status: await card.locator(this.statusDetail).innerText(),
                matched: await card.locator(this.matchedProductTag).innerText(),
                // description: await card.locator(this.descriptionDetail).innerText(),
                isVideo: await card.locator(this.playIcon).isVisible()
            })
        }
        return contentCardDetails
    }

    async validateTheContentCardDetails(items) {
        await test.step('Validate the Content Card Details are correct', async() => {
            const displayedCardDetails = await this.getDetailsOfDisplayedContentCards()
            for(let x = 0; x < items.length; x++){
                slowExpect(displayedCardDetails[x].title).toBe(items[x].title)
                slowExpect(displayedCardDetails[x].matched).toBe(items[x].matched.toString())
    
                const formattedDate = await this.convertEpochDateToFormattedDate(items[x].date_created)
                slowExpect(displayedCardDetails[x].createDate).toBe(formattedDate.toString())
    
                if(items[x].status == "approved") { slowExpect(displayedCardDetails[x].status).toBe("Published")}
    
                items[x].entityType == "1"
                    ? slowExpect(displayedCardDetails[x].isVideo).toBeTruthy()
                    : slowExpect(displayedCardDetails[x].isVideo).toBeFalsy()
            }
        })
    }

    async validateThatEachContentCardDisplaysCorrectDetails(items) {
        await this.validateThatEachContentCardHasAllNecessaryDetailsDisplayed()
        await this.validateTheContentCardDetails(items)
    }

    async enterSearchField(search) {
        await test.step(`Enter Search Keyword - ${search}`, async () => {
            await this.page.locator(this.searchFld).fill(search)
            await this.getContentList()
        })
    }

    async validateThatContentCardThatMatchesSearchIsDisplayed(search) {
        await test.step('Validate that displayed Content Card is correct based on search result', async () => {
            const displayedCardDetails = await this.getDetailsOfDisplayedContentCards()
            for(let x = 0; x < displayedCardDetails.length; x++){
                slowExpect(displayedCardDetails[x].title.toLowerCase()).toContain(search.toLowerCase())
            }
        })
    }

    async clearSearchField() {
        await test.step('Clear Search field', async () => {
            await this.page.locator(this.closeBtn).click()
        })
    }

    async validateSeachFieldIsCleared() {
        await test.step('Validate Search Field is cleared', async () => {
            await slowExpect(await this.page.locator(this.searchFld)).toHaveValue("")
        })
    }

    async validateNoContentCardToDisplayeMsgIsDisplayed() {
        await test.step('Verify that No Content Card to Display message is visible', async () => {
            await slowExpect(await this.page.locator(this.noContentMsg)).toBeVisible()
        })
    }

    async clickContentCard() {
        await test.step('Open a content card', async () => {
            await this.page.locator(this.contentCard).first().click()
        })
    }

    async validateThatDetailsPageIsDisplayed() {
        await test.step('Validate that Details page is opened', async () => {
            await slowExpect(this.page).toHaveURL(/details/)
        })  
    }

    async clickCreateNewPost(type) {
        await test.step(`Click Create New Content - ${type} button`, async () => {
            await this.page.locator(this.createContentBtn).hover()
            type === 'Photo'
                ? await this.page.locator(this.createPhotoBtn).click()
                : await this.page.locator(this.createVideBtn).click()
        })  
    }

    async closeDialog() {
        await test.step('Click Close button', async () => {
            await this.page.locator(this.closeBtn).click()
        })
    }

    async validateThatDialogForNewPostIsDisplayed(type) {
        await test.step(`Validate that dialog for new ${type} is displayed`, async () => {
            type === 'Photo'
            ? await slowExpect(await this.page.locator(this.newPhotoDialog)).toBeVisible()
            : await slowExpect(await this.page.locator(this.newVideoDialog)).toBeVisible()
        })
    }
}

module.exports = Content