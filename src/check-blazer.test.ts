import { test as auto, expect } from "playwright/test"
import { Resend } from "resend"
import "dotenv/config"


auto("Check if item is available", {}, async ({ page }) =>
{
    auto.setTimeout(60_000)
    await page.goto("https://www.lindberghfashion.com/da-dk/p/lindbergh-blazer/30-308031/30-308031dk-grey-mel")

    let cookieBannerButton = page.getByRole("alert", { name: "Kun nødvendige" })
    if (await cookieBannerButton.isVisible()) await cookieBannerButton.click()
    
    let option = page.getByText(/^56$/).first()
    expect(option).toBeTruthy()

    if (!await option.isDisabled()) {
        console.log("sending email...")
        const r = new Resend(process.env.RESEND_API_KEY)
        const { error } = await r.emails.send({
            from: process.env.FROM_EMAIL!,
            to: process.env.TO_EMAIL!,
            subject: "Item is available!",
            html: "The blazer is available in the correct size: https://www.lindberghfashion.com/da-dk/p/lindbergh-blazer/30-308031/30-308031dk-grey-mel"
        })
        if (error) throw error
        console.log("email sent.")
    } else {
        console.log("item not in stock")
    }
})