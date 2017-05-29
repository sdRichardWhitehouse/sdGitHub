var nodemailer = require('nodemailer');

module.exports = {
    db = null,
    connect: function() {
        console.log("connecting");
        db = monk('localhost:27017/sdGitHub');
        console.log("connected");
    },
    getSiteList: function () {
        console.log("getting site list");
        db = req.db;
        var collection = db.get('sites');
        collection.find({},{},function(e,docs){
            console.log(docs);
        });
        console.log("ending getting site list");
    }
};