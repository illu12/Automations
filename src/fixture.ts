import { test as base, expect } from "playwright/test"
import { EmailService } from "./services/email.js"
import "dotenv/config"


type Fixtures = {
    email: EmailService
}

export const test = base.extend<{}, Fixtures>({
    email: [async ({}, use) => {
        await use(new EmailService())
    }, { scope: "worker" }]
})

export { expect }




