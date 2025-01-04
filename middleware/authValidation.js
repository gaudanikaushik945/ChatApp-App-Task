const jwt = require("jsonwebtoken")


exports.verifyToken = async (req, res, next) => {
    try {
        const authHeader = await req.header("Authorization");
        console.log("=========authHeader========", authHeader);
        if (!authHeader) {
            return res.status(401).json({
                data: false,
                message: "Unauthorized request"
            });
        }
        const token = await authHeader.split(' ')[1];
        console.log("-----token----==================== ", token);

        const jwtToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log("-----jwtToken------", jwtToken);

        if (!jwtToken) {
            return res.status(401).json({
                message: 'Unauthorized request1'
            });
        }

        
        tokenChek = jwtToken;

        next();

    } catch (error) {
        console.log("-----error------", error);
        return res.status(401).json({
            data: false,
            message: "Invalid token"
        });
    }
}