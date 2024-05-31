import { createTransport } from 'nodemailer'

export interface mailOptions {
    from?: string;
    to?: string;
    subject?: string;
    text?: string;
    html?: string;
    template?: string;
}

let transporter = createTransport({
    host: `${process.env.SMTP_HOST}`,
    port: parseInt(`${process.env.SMTP_PORT}`),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

transporter.verify(function (error: Error, success: boolean) {
    if (error) {
        console.log('Mail connection error: ', error);
        throw error;
    } else {
        console.log('Mail connection successful');
    }
});

export const sendMail = async (data: mailOptions) => {
    try {
        data.from = "Flatios email system";
        let result = await transporter.sendMail(data);
        let info = {
            messageId: result.messageId,
            to: result.envelope.to[0],
            from: result.envelope.from,
            response: result.response
        }
        return { data, info };
    } catch (error) {
        throw error;
    }
};