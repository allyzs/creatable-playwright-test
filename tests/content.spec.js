import { test } from '../fixtures/fixtures'

test.beforeEach('Open creatable and login', async ({login}) => {
    await login.doFullLogin()
})

test.describe('Contents - Menu Page', () => {
    test('Content - Default Display', async ({navigation, content}) => {
        await navigation.navigateToMenuPage('Content')
        const contentList = await content.getContentList()
        await content.validateThatContentPageIsDisplayed()
        await content.validateThatNumberOfDisplayedContentIsCorrect(contentList.items.length)
        await content.validateThatEachContentCardDisplaysCorrectDetails(contentList.items)
    })

    test('Content - Search Function', async ({ navigation, content}) => {
        await navigation.navigateToMenuPage('Content')
        const contentList = await content.getContentList()
        //Valid Search Keyword
        let search = "Image"
        await content.enterSearchField(search)
        await content.validateThatContentCardThatMatchesSearchIsDisplayed(search)
        //Clear Search Field
        await content.clearSearchField()
        await content.validateSeachFieldIsCleared()
        await content.validateThatNumberOfDisplayedContentIsCorrect(contentList.items.length)
        //Invalid Search Keyword
        search = "invalidKeyword"
        await content.enterSearchField(search)
        await content.validateNoContentCardToDisplayeMsgIsDisplayed()
        await content.validateThatNumberOfDisplayedContentIsCorrect(0)
    })

    
    test('Content Card Details', async ({ navigation, content}) => {
        await navigation.navigateToMenuPage('Content')
        await content.clickContentCard()
        await content.validateThatDetailsPageIsDisplayed()
    })

    test('Create New Content Function', async ({ navigation, content}) => {
        await navigation.navigateToMenuPage('Content')
        let contentType = ["Photo", "Video"]
        for (const type of contentType) {
            await content.clickCreateNewPost(type)
            await content.validateThatDialogForNewPostIsDisplayed(type)
            await content.closeDialog()
        }
    })

})