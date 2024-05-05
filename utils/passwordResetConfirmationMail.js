import nodemailer from "nodemailer";

export const sendPasswordResetConfirmationMail = async(user) => {
    const transport = nodemailer.createTransport({
        service: process.env.SERVICE,
        auth: {
            user: process.env.MAIL,
            pass: process.env.PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.MAIL,
        to: user.email,
        subject: 'Password Reset Successful',
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    /* Add your custom CSS styles here */
                    body {
                        font-family: Arial, sans-serif;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        text-align: center;
                        color: blue;
                    }
                    .logo {
                        max-width: 150px;
                    }
                    .content {
                        margin-top: 20px;
                        color: purple;
                    }
                    /* Mobile Responsive Styles */
                    @media only screen and (max-width: 600px) {
                        .container {
                            padding: 10px;
                        }
                        .logo {
                            max-width: 100px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img class="logo" src="https://files.codingninjas.in/logo1-32230.png" alt="Storefleet Logo">
                        <h1>Password Reset Successful</h1>
                    </div>
                    <div class="content">
                        <p class="header" style="color: purple">Hello, ${user.name}</p>
                        <p>Your password has been successfully reset.</p>
                        <p>If you did not request this change, please contact support immediately.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    };
    try{
        await transport.sendMail(mailOptions);
    }
    catch(err)
    {
        console.log(err);
    }
};