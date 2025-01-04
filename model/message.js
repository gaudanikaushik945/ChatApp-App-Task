const { required, boolean } = require("joi")
const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
},
message: {
    type: String,
    required: false
},
reciver_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
},
isDeleted: {
    type: Number,
    enum: [0, 1],
    required: false
},
isSeen: {
    type: Boolean,
    required: false
}
})




const Message = new mongoose.model("Message", messageSchema)
module.exports = Message