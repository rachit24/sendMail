const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express(); 

if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "config/config.env" });
}

//set views file
app.set('views',path.join(__dirname,'views'));
			
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: "dekhlo30@gmail.com",
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});
    
// Base index route
app.get('/',(req, res) => {
    res.render('email', {
        title: 'Special Stuff',
    });
});
          
app.post('/sendmail',(req, res) => {
    
    let randomNum = Math.floor(Math.random() * 3);
    let message = [`Text 0 +${randomNum}`,
    `Text 1 +${randomNum}`,
    `Text 2 +${randomNum}`,]
    let Finalmessage = message[randomNum];

    let mail_subject = 'Subject-' + randomNum;

    let messageOptions = {
        from: 'Rachit Khurana <dekhlo30@gmail.com>',
        to: process.env.EMAIL_TO,
        subject: mail_subject,
        html: Finalmessage
    };
    let file = ['Pdf0.pdf','Pdf1.pdf','Photo2.png'];
    let finalFile = file[randomNum];
    let dest = ['Resources/AI.pdf','Resources/SOWB.pdf','Resources/rachit.png'];
    let finalDest = dest[randomNum];

    messageOptions = {...messageOptions, attachments: [
        {
            filename: finalFile,
            path: finalDest
        }
    ]};

    transporter.sendMail(messageOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
        res.redirect('/');
    });
});
   
// Server Listening
app.listen(process.env.PORT, () => {
    console.log(`Server is running at port ${process.env.PORT}`);
});

    