import { Resend } from "resend"


export class EmailService {

    constructor() {}

    async sendEmail(to: string, subject: string, html: string) {
        const r = new Resend(process.env.RESEND_API_KEY)
        const { error } = await r.emails.send({
            from: process.env.FROM_EMAIL!,
            to,
            subject,
            html
        })
        if (error) throw error
    }

}