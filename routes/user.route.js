const express = require("express")
const router = express.Router()
const userController = require("../controller/user.controller")
const {validateRequest, userValidationSchema, loginValidationSchema} = require("../middleware/validation")
const {verifyToken} = require("../middleware/authValidation")




router.post("/register/user",  validateRequest(userValidationSchema), userController.userRegister)
router.post("/login/user", validateRequest(loginValidationSchema), userController.userLogin)
router.get("/get/user", verifyToken, userController.getAllUser)




module.exports = router