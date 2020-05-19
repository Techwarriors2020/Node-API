var EventEmitter = require('events');
var nodemailer = require("nodemailer");
var config = require('../config');
exports.sendMail = function(email, link){
    var emitter = new EventEmitter()
    let transporter = nodemailer.createTransport({
       host: "smtp.gmail.com",
       port: 465,
       secure: true, // true for 465, false for other ports
       auth: {
         user: 'techhwarrior@gmail.com', // generated ethereal user
         pass: 'Tech@#86' // generated ethereal password
       }
     });
     // setup email data with unicode symbols
     let mailOptions = {
       from: '"E-Mart" <support@emart.com>', // sender address
       to: email, // list of receivers
       subject: "Registration verification email from E-Mart", // Subject line
       text: "Hi", // plain text body
       html: `<b>You have just registered on <a href=${config.websiteUrl}>E-Mart</a></b>
       <div><a href=${link} target="_blank">Click here</a> to verify your account.</div>` // html body
     };
   
     // send mail with defined transport object
   transporter.sendMail(mailOptions , function(err,info){
       if(err) {
            console.log("DANGER_ERROR", err);
            emitter.emit('ERROR', err);
       } else {
            emitter.emit('DONE');
            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
       }
   }) 

   return emitter
 }