const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express(); 
const connectDB = require("./config/db");
const mongoose = require("mongoose");
const Value = require("./models/Value.js")
// const updateValue = require("./config/update");
// const createValue = require("./config/create");
// const findValue = require("./config/find");


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
app.get('/',async(req, res) => {
    const limit = await Value.findOne({ name: "limit" });
    const val = limit.value_index;
    res.render('email', {
        limit: val,
    });
});

// app.get('/limit',(req, res) => {
//     res.render('limit', {
//         title: 'Daily Limit Exceeded',
//     });
// });

connectDB();

app.post('/verify',async(req,res)=>{
    try {
        ucode=req.body.gcode; 
        const num = await Value.findOne({ name: "code" });
        if(ucode==num.value_index){
            const final = await Value.updateOne(
                { name: "limit" },
                { $set: { value_index: 0 } }
            );
            console.log("verified!");
            let randomNum = Math.floor(Math.random() * 90000);
            console.log(randomNum);        
            const some = await Value.updateOne(
                { name: "code" },
                { $set: { value_index: randomNum } }
                );
                res.render('popup', {
                    comment: 'Code is verified. Welcome to a new day babe!',
                });
        }else{
            console.log("Not verified!");            
            res.render('popup', {
                comment: 'Wrong Code! Try again!',
            });
        }
        // res.redirect('/');
    } catch (error) {
        res.render('popup', {
            comment: 'BackEnd Error',
        });
        console.log(error);
        process.exit(1);
    }
});

app.post('/code',async (req,res)=>{
    try {
        let randomNum = Math.floor(Math.random() * 80000);
        console.log(randomNum);        
        const some = await Value.updateOne(
            { name: "code" },
            { $set: { value_index: randomNum } }
        );

        let messageOptions = {
            from: 'Rachit Khurana <dekhlo30@gmail.com>',
            to: '@gmail.com',
            subject: 'Code',
            html: `The code is: ${randomNum}`
        };

        transporter.sendMail(messageOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
            res.render('popup', {
                comment: 'Rachit has received the code. Take the code from him.',
            });
            // res.redirect('/');
        });

    } catch (error) {
        res.render('popup', {
            comment: 'BackEnd Error',
        });
        console.log(error)
        process.exit(1);
    }    
});

app.post('/sendmail',async (req, res) => {
    try {
        const limit = await Value.findOne({ name: "limit" });
        const val = limit.value_index;
        console.log(val);
        if(val<=2){
            const position = await Value.findOne({ name: "Incrementor" });
            
            let i = position.value_index;
            console.log(i);

            let message = [`Text1`,`Text2`];

            let Finalmessage = message[i];
    
            let mail_subject = i;
    
            let messageOptions = {
                from: 'Rachit Khurana <dekhlo30@gmail.com>',
                to: process.env.EMAIL_TO,
                subject: mail_subject,
                html: Finalmessage
            };
            let file = ['Celebration.jpg'];
            let finalFile = file[i];
            let dest = ['Resources/pic1.jpg'];
            let finalDest = dest[i];
    
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
                res.render('popup', {
                    comment: 'Email Sent! Check your mail.'
                });
                // res.redirect('/');
            });
            
            const result = await Value.updateOne(
                { name: "Incrementor" },
                { $inc: { value_index: 1 } }
            );
            const final = await Value.updateOne(
                { name: "limit" },
                { $inc: { value_index: 1 } }
            );
        }else{
            res.render('popup', {
                comment: 'Limit exceeded!'
            });
            console.log("Limit exceeded!");
            // res.redirect('/');
        }

    } catch (error) {
        res.render('popup', {
            comment: 'BackEnd Error'
        });
        console.log("Sending Mail Failed💥 "+error);
        process.exit(1);
    }
});
   
// Server Listening
app.listen(process.env.PORT, () => {
    console.log(`Server is running at port ${process.env.PORT}`);
});

    
