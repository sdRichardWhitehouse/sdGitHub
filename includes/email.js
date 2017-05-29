var nodemailer = require('nodemailer');

module.exports = {
    sendEmail: function () {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: 'idev.shopdirect@gmail.com',
            pass: 'idev2015'
            }
        });

        var mailOptions = {
            from: 'idevelopment@shopdirect.com',
            to: 'richy@richant.co.uk',
            subject: 'Sending Email using Node.js',
            text: 'That was easy!'
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
            console.log('Email sent: ' + info.response);
            }
        });
    }
};