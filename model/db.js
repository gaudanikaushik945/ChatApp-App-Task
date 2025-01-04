const mongoose = require("mongoose")
require("dotenv").config()



mongoose.connect(process.env.MONGO_URL, 
)
.then(() => {
    console.log(`===== mongodb database connection successfully ======== ${process.env.MONGO_URL}` );
}).catch((error) => {
    console.log("===== error =======", error);   
})



module.exports = mongoose