const User = require("../model/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()



exports.userRegister = async(req, res) => {
    try {
        console.log("+++++++++++++++++phone_number++++++++++++++++++++++++++",User.findOne({phone_number: req.body.phone_number}));
        
        const findUser = await User.findOne({phone_number: req.body.phone_number})
        console.log("+++++++++++ findUser ++++++++++++++++", findUser);
        if (findUser) {
            return res.status(400),json({
                data: false,
                message: "user is already registered with this mobile number."
            })
        }

      

        const securePassword = await bcrypt.hash(req.body.password, 10);
        console.log("------ securePassword ----------", securePassword);

        
        const userData = {
         name: req.body.name,
         phone_number: req.body.phone_number,
         email: req.body.email,
         password: securePassword
          };



        const storeUserData = await User.create(userData)
        console.log("----- storeUserData --------", storeUserData);


        return res.status(201).json({
            userData: storeUserData,
            message : "user register successfully"
        })
        
        
    } catch (error) {
        console.log("===== error =====", error);
        return res.status(500).json({
            data: false,
            message: "An unexpected error occurred while registering the user. Please try again later."
        })
        
    }
}





exports.userLogin = async(req, res) => {
    try {
        const findUser = await User.findOne({phone_number: req.body.phone_number})
        console.log("+++++++++++ findUser ++++++++++++++++", findUser);
        if (!findUser) {
            return res.status(404),json({
                data: false,
                message: "User not found with this mobile number."
            })
        }

        const passwordMatch = await bcrypt.compare(req.body.password, findUser.password)
        console.log("============ passwordMatch ===============", passwordMatch);
        if (!passwordMatch) {
            return res.status(400).json({
                data: false,
                message: "Incorrect password."
            }); 
        }


        const userToken = jwt.sign({userId: findUser._id, phone_number: findUser.phone_number}, process.env.JWT_SECRET,  { expiresIn: "24h" })
        console.log("----------- userToken ---------------------", userToken);
       
        findUser.token = userToken;
        await findUser.save()
        return res.status(201).json({
            user: findUser,
            token: userToken ,
            message: "user login successfully"
        })

    } catch (error) {
        console.log("==== error =====", error);
        return res.status(500).json({
            data: false,
            message: "An unexpected error occurred while login the user. Please try again later."
        })
    }
}






exports.getAllUser = async (req, res) => {
    try {
        const userToken = tokenChek; 
        console.log("===== userToken =======", userToken);
       
        const findUser = await User.find({ _id: { $ne: userToken.userId } });
        console.log("+++++++++++ findUser ++++++++++++++++", findUser);

        if (!findUser || findUser.length === 0) {
            return res.status(404).json({
                data: false,
                message: "No other users found.",
            });
        }

        return res.status(200).json({
            data: true,
            users: findUser,
            message: "User data retrieved successfully, excluding the logged-in user."
        });

    } catch (error) {
        console.log("==== error =====", error);
        return res.status(500).json({
            data: false,
            message: "An unexpected error occurred while retrieving users. Please try again later."
        });
    }
};
