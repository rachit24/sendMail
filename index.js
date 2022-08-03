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
            to: 'rachit.khurana2400@gmail.com',
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

            let message = [`Hi Ranjana. Surprised?? Thoda sa? nahi? koi ni chal 😂<br>
            I hope you liked the previous gift. That was something new which I learnt for you. You've made me do many kind of crazy things and I love that. Thanks for coming into my life and directing me towards all good things and positivity. <br>
            Now this the 2nd gift that I am giving you after your bday🤭<br>
            This might be a type of gift you've never expected someone to give you 😬<br>
            But yeah unexpected things often give us happiness and I hope you're happy. Happy belated Birthday my superstar.. photo achi hai na?? hehe.<br>
            See you in the next one. Bye 😘`,

            `I would like to remind you that you are really a special girl if you have forgotten.<br>
            I have always found you very interesting and a very unique type of girl and now you've stolen my heart 💓<br>
            I want to keep you mine till the time we are together and I hope we stay together forever 😌
            Rhyming hogya thoda xD acha lag rha h.<br>
            Anyway, I hope you are enjoying this. Be ready for more upcoming surprises❤️<br>
            Cute hai na collage??`,

            `I really hope everything is good 🔥 hoped you liked all the gifts that I've given to you even though you wanted nothing, I'm really sorry but I just like giving things to you (no matter how small they are)<br>
            Take some rest dear, it is very nice to see you grow old with me. Hope it continues for a very long period of time. May our 3G live very long.<br>
            I have learnt to live life more colorfully. I'm blessed to have you shaan. You are such a gentle and a kind woman(yes woman, getting older each year😬 + saree me kya sexy lag rahi thi.... ufffffffffffffffffffffffffffff)<br>
            I love your smile. Let's end this day with a good note. Your smile makes my day brighter. So freakin gorgeous`,

            `I know you are thinking how long will this continue? I will tell you don't worry. Just sit back and enjoy my creativity ;-) <br>
            Just learning from you. I wanted to thank you for teaching me a lot of amazing stuff.
            Let's start this beautiful day with a cutest photos of all time. <br>
            Download it babe you are truly so innocent and badmash also. So sweet so peaceful so graceful so amazing. I love you Ranjana❤️`,

            `Hey beautiful 🏵️ welcome to another mail. Hope you are feeling more responsible and mature after turning 21. Hehehe just joking real maturity comes with experience age is just a number. You are going to be forever young. Young at heart and soul. You are an epitome of kindness truly😌 I feel grateful everyday that destiny put use together and now we have come this far.
            Let us take a moment to appreciate the stunning natural beauty you have got. Bht cute ho yr I swear. Itne time se dekh raha hu abhi bhi aankhe thaki nahi bilkul bhi!!!!`,

            `Hello once again I'm writing this during end of April and I know I'm doing things really early. I started making this whole system very early in March 😬 what can I do? You made me fall so hard for you now I just want to do the best I can do for you. And I'm 100% sure that you are worth it. <br>
            You deserve so much Ranjana ❤️ all the good things in this world. I can't promise you all the happiness but I promise I'll be there for you in all you hard times.<br>
            Created a small card for you.. because photos kaafi saari hogyi lol`,

            `Hello once again, Ranjana.<br>
            I really hope you are enjoying this 😬 I am writing this around 1st of May. Everything seems to be working fine and I'm really excited to give this all to you 🥺 <br>
            I want to share this all with you right now but I'm controlling myself 😭 <br>
            We do special things for special people and you are the most special thing ever to me 😊<br>
            I have so much to say so much to you, I would run out of words.. so I thought of doing some smartwork.<br>
            One little playlist I have created for you to dedicate some songs. Kabhi bhi sun lena bs kuch baate gaa kar bhi kehna chahta hu.. yahi milega sab`,
            
            `<body style="background-color:black">
            <table align="center" border="0" cellpadding="0" cellspacing="0"
                width="550" bgcolor="white" style="border:2px solid black">
                <tbody>
                    <tr>
                        <td align="center">
                            <table align="center" border="0" cellpadding="0"
                                cellspacing="0" class="col-550" width="550">
                                <tbody>
                                    <tr>
                                        <td align="center"
                                            style="background-color: #4cb96b;
                                                height: 50px;">
                                            
                                            <a href="#" style="text-decoration: none;">
                                                <p style="color:white;font-weight:bold;">
                                                    Hey cutie pie. I hope you are not getting bored with these mails. To keep things interesting I'm stepping the level and I will design all the rest of just like you have added all the good stuff in my life. You are always there with me when things get hard. I would really love to thank uncle and aunty for bringing this creature to life 😂
                                                </p>
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center"
                                            style="background-color: #c9e1ff;
                                                height: 50px;">
                                            
                                            <a href="#" style="text-decoration: none;">
                                                <p style="color:brown;font-weight:bold;">
                                                    You are really strong babe❤️ don't ever you listen to stupid people. People are always stupid. I know you. I find you really strong. You are a precious gem😚
                                                </p>
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center"
                                        style="background-color: #ff6ba1;
                                            height: 50px;">
                                        
                                        <a href="#" style="text-decoration: none;">
                                            <p style="color:white;font-weight:bold;">
                                        I have attached Our little love story...
                                            </p>
                                        </a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </body>`,

            `<html>
            <style>
        :root {
            --main: #000000;
            --second: #52057B;
            --third: #892CDC;
            --contrast: #BC6FF1;
        }
        
        @font-face {
            font-family: "Honey";
            src: url("https://github.com/cromega08/404_webpage/blob/master/fonts/Honey-Notes-BE/Honey%20Notes%20DEMO.ttf");
        }
        
        @font-face {
            font-family: "Jorell";
            src: url("https://github.com/cromega08/404_webpage/blob/master/fonts/Jorell-Lieven-Demo/13%20Jorell%20Lieven/Jorell%20Lieven%20Demo.ttf");
        }
        
        body {
            min-height: 100vh;
            background-image: linear-gradient(to top, #5f72bd 0%, #9b23ea 100%);
            color: var(--contrast);
            font-family: "Honey";
            display: grid;
            justify-content: center;
            align-content: center;
            justify-items: center;
            align-items: center;
        }
        
        div {
            margin: 1em;
            padding: .05em 2em 2em 2em;
            background-color: var(--main);
            border: solid;
            border-radius: 1em;
            display: grid;
        }
        
        button {
            background-color: var(--contrast);
            border: none;
            border-radius: 1em;
            cursor: pointer;
            width: 16em;
            height: 5em;
            margin: 0;
            box-shadow: .5em .5em 0 0 var(--main);
            display: inline-flex;
            align-items: center;
            position: relative;
            top: 1em;
        }
        
        button img {
            width: 7em;
            height: 7em;
            display: grid;
            align-items: center;
            justify-items: center;
        }
        
        button p {
            margin: 0;
            font-size: 2em;
            line-height: .75em;
            font-family: "Honey";
            color: var(--second);
        }
        
        button a {
            text-decoration: none;
        }
        
        button:hover {
            animation: glow_dark 500ms ease forwards;
        }
        
        button:active {
            width: 14em;
            height: 4em;
            margin-top: .5em;
            margin-bottom: .5em;
        }
        
        button:active img {
            width: 6em;
            height: 6em;
        }
        
        button:active p {
            font-size: 1.65em;
        }
        
        p {
            font-size: 2.5em;
            margin-bottom: .1em;
            display: grid;
            justify-self: center;
            align-self: center;
        }
        
        label {
            margin: .5em;
            font-size: 1.3em;
        }
        
        img {
            width: 3em;
            height: 3em;
            vertical-align: middle;
        }
        
        footer {
            font-family: "Jorell";
            font-size: 1.2em;
            background-color: var(--main);
            border: solid;
            border-radius: 1em;
            padding: .5em;
            display: inline-flex;
            flex-direction: row;
            justify-items: center;
            align-items: center;
        }
        
        footer img {
            border: none;
            border-radius: 50%;
        }
        
        footer img:hover {
            animation: glow_img 500ms ease forwards;
        }
        
        #text_link {
            text-decoration: none;
            color: var(--main);
            background-color: var(--third);
            padding: .15em .5em .15em .5em;
            border-radius: 1em;
        }
        
        #text_link:hover {
            animation: glow_bright 500ms ease forwards;
        }
        
        #text_link:visited {
            text-decoration: none;
            color: var(--contrast);
            background-color: transparent;
            box-shadow: 0 0 .7em 0 var(--contrast);
        }
        
        @keyframes glow_img {
            to {
                box-shadow:inset 0 0 0 .5em var(--contrast), -.035em -.04em 0 .2em var(--contrast);
            }
        }
        
        @keyframes glow_bright {
            to {
                box-shadow: 0 0 .7em 0 var(--contrast);
            }
        }
        
        @keyframes glow_dark {
            to {
                top: .5em;
                box-shadow: 1em 1em 0 0 var(--main);
            }
        }
            </style>
        
            <body>
                <div>
                    <p>Somethings That I Love About You: </p>
                    <label>
                        <img src = "https://github.com/cromega08/404_webpage/blob/master/imgs/kitty%20(3).png?raw=true" alt="Kitty Sleeping "/>
                    Your face when you sleep, especially in my arms. It truly feels like heaven. You sleep like a little baby. So calm, so cute, so small. ugghhh so many feelings very hard to express in words!!!
                    </label>
                    <label>
                        <img src = "https://github.com/cromega08/404_webpage/blob/master/imgs/kitty%20(2).png?raw=true" alt="Kitty writing"/>
        Your drawings, paintings, ideas, cooking, dressing and organising everything in place. Really your creativity is out of this wolrd Ranjana😍
                    </label>
                    <label>
                        <img src = "https://github.com/cromega08/404_webpage/blob/master/imgs/kitty%20(5).png?raw=true" alt="Kitty Sherlock"/>
        Your cute anger.. whenever you get angry, I love to look at that dangerous+cute face. (it gets funny sometimes) Also we have cried together, that was a little extra emotional but yesss... cute little angry woman. 
                    </label>
                    <label>
                        <img src = "https://github.com/cromega08/404_webpage/blob/master/imgs/kitty%20(6).png?raw=true" alt="Kitty Programmer"/>
        Always ready to help. You are the first one who comes into my mind whenever I need opinions or when I get stuck on something. You have become a very special part of me Ranjana!
                    </label>
        
                </div>
            </body>
        </html>
        `,

        `<a href=" https://rachit24.github.io/msg/" rel="author" target="_blank">
        <h1 style = "margin: 0 .3em 0 0;">Click Me then open the video</h1>
        </a>`]

            let Finalmessage = message[i];
    
            let mail_subject = 'Love Letter - ' + i;
    
            let messageOptions = {
                from: 'Rachit Khurana <dekhlo30@gmail.com>',
                to: process.env.EMAIL_TO,
                subject: mail_subject,
                html: Finalmessage
            };
            let file = ['Celebration.jpg','R2.jpg','Smile.jpg','Childhood.jpg','Beauty.jpg','Creativity.pdf','Spotify.jpeg','Day.mp4','No Attachment only love','Dance.mp4'];
            let finalFile = file[i];
            let dest = ['Resources/pic1.jpg','Resources/pic.jpg','Resources/pic3.jpg','Resources/pic2.jpg','Resources/pic4.jpg','Resources/card.pdf','Resources/playlist.jpeg','Resources/animation.mp4','Resources/empty.docx','Resources/dance.mp4'];
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

    