const {model, Schema} = require("mongoose");
const Joi = require("joi");

const schemaUser = new Schema({
    email : String ,
    password : String ,
    role : {
        type : String ,
        enum : ["client", "admin"]
    } ,
    dt_creation : {type : Date , default : Date.now}
});

const userValidation = Joi.object({
    email :  Joi.string().email({ tlds: { allow: false } }).required(),
    password : Joi.string().min(5).required()
})

const User = model("users" , schemaUser);

module.exports.User = User
module.exports.schemaUser = schemaUser
module.exports.userValidation = userValidation
