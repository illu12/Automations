import { test as job, expect } from "../fixture.js"



job("Check washing machine availability", async ({ page, email }) => 
{
    job.setTimeout(60_000)

    // Login
    await page.goto("https://e-vaskeri.dk/");
    await page.getByRole("textbox", { name: "Mobilnr. eller e-mail" }).click();
    await page.getByRole("textbox", { name: "Mobilnr. eller e-mail" }).fill(process.env.E_VASKERI_EMAIL!)
    await page.getByRole("textbox", { name: "Password" }).click()
    await page.getByRole("textbox", { name: "Password" }).fill(process.env.E_VASKERI_PASSWORD!)
    await page.getByRole("button", { name: "Log ind" }).click()

    // Go to calendar reservation view
    await page.getByRole("heading", { name: "Saldo" }).waitFor()
    await page.getByRole("img", { name: "Henter data" }).waitFor({ state: "hidden" })
    await page.getByRole("button", { name: "Reservér" }).click()

    const navigateCalendarButton = page.getByRole("button", { name: "Vaskemaskine 1 - 5, Ny" })
    await navigateCalendarButton.waitFor({ state: "visible", timeout: 10_000 })
    await navigateCalendarButton.click()

    // Get todays column
    const todayColumn = page.locator("div.col.colcalendar").filter({ hasText: "I dag" })
    await expect(todayColumn).toHaveCount(1)

    // Iterate all accepted slots
    const eveningSlots = ["16:00 - 18:00", "18:00 - 20:00", "20:00 - 22:00"]
    const available: string[] = []
    for (const time of eveningSlots) {
        const slot = todayColumn.getByRole("button", { name: time })
        await slot.waitFor()
        if (await slot.getAttribute("tabindex") === "0") available.push(time)
    }
    console.log("Available:", available.length ? available.join(", ") : "none")

    // If available, send email
    if (available.length) {
        await email.sendEmail(
            process.env.TO_EMAIL!,
            "Washing machine available tonight",
            `Free slots today: ${available.join(", ")}`
        )
    }
})