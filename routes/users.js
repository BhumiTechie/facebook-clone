var mongoose = require('mongoose');
var plm = require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/n15passsport");

var userSchema = mongoose.Schema({
    username:String,
    age:Number,
    password:String,
    email:String,
    image:String
});

userSchema.plugin(plm);

module.exports = mongoose.model("user", userSchema);