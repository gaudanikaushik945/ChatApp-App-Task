const { required } = require("joi")
const { default: mongoose } = require("mongoose")
const mongose = require("mongoose")



const userSchema = new mongose.Schema({
    name:{
        type: String,
        required: false
    }, 
    phone_number: {
       type: Number,
       required: false
    },
    email: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    token: {
        type: String,
        required: false
    }
})


const User = new mongoose.model("User", userSchema)
module.exports = User