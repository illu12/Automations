import { test as job, expect } from "../fixture"



job("Check if item is available", {}, async ({ page, email }) =>
{
    job.setTimeout(60_000)
    try {
        const URL = "https://www.lindberghfashion.com/da-dk/p/lindbergh-blazer/30-308031/30-308031dk-grey-mel"
        await page.goto(URL)
    
        let cookieBannerButton = page.getByRole("alert", { name: "Kun nødvendige" })
        if (await cookieBannerButton.isVisible()) await cookieBannerButton.click()
    
        let option = page.getByText(/^56$/).first()
        expect(option).toBeTruthy()
    
        if (!await option.isDisabled()) {
            console.log("sending email...")
            await email.sendEmail(process.env.TO_EMAIL!, "Item is available!", `The blazer is available in the correct size: ${URL}`)
            console.log("email sent.")
        } else {
            console.log("item not in stock")
        }
    } catch (err) {
        await email.sendEmail(process.env.TO_EMAIL!, "Problem in check blazer job", JSON.stringify(err))
    }
})





