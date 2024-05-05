import nodemailer from "nodemailer";

export const sendWelcomeMail = async(user)=>{
    const transport = nodemailer.createTransport({
        service : process.env.SERVICE,
        auth : {
            user: process.env.MAIL,
            pass: process.env.PASSWORD
        }
    })
    const mailOptions = {
        from : process.env.MAIL,
        to : user.email,
        subject : 'Welcome',
        html : `
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
                        color : blue;
                    }
                    .logo {
                        max-width: 150px;
                    }
                    .content {
                        margin-top: 20px;
                        color: purple;
                    }
                    #btn{
                        padding: 10px 20px;
                        background-color: #20d49a;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 5px;
                        cursor: pointer;
                    }
                    /* Mobile Responsive Styles */
                    @media only screen and (max-width: 600px) {
                        .container {
                            padding: 10px;
                        }
                        .logo {
                            max-width: 100px;
                        }
                        #btn {
                            display: block;
                            margin-top: 10px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img class="logo" src="https://files.codingninjas.in/logo1-32230.png" alt="Storefleet Logo">
                        <h1>Welcome to Our site</h1>
                    </div>
                    <div class="content">
                        <p class="header" style="color: purple">Hello, ${user.name}</p>
                        <p>Thank you for registering with us.We're excited to have you as a new member of our community.</p>
                        <div style="text-align: center;">
                            <button id="btn">Get started</button>
                        </div>
                    </div>
                </div>
            </body>
            </html>
            `,
        }
    await transport.sendMail(mailOptions);
}