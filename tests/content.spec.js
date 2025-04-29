import { test } from '../fixtures/fixtures'

test.beforeEach('Open creatable and login', async ({login}) => {
    await login.doFullLogin()
})

test.describe('Contents - Menu Page', () => {
    test('Validate that Contents are properly displayed', async ({navigation, content}) => {
        await navigation.navigateToMenuPage('Content')
        const contentList = await content.getContentList()
        await content.validateThatContentPageIsDisplayed()
        await content.validateThatNumberOfDisplayedContentIsCorrect(contentList.items.length)
        await content.validateThatEachContentCardDisplaysCorrectDetails(contentList.items)
    })
})