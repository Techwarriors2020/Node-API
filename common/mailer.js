var EventEmitter = require('events');
var nodemailer = require("nodemailer");
var config = require('../config/environment');
const SMTP_CONFIG = require("../config/smtp");
exports.sendMail = function(email, link){
    var emitter = new EventEmitter()
    let transporter = nodemailer.createTransport({
      host: SMTP_CONFIG.host,
      port: SMTP_CONFIG.port,
      secure: false,
      auth: {
        user: SMTP_CONFIG.user,
        pass: SMTP_CONFIG.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
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