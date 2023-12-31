require("dotenv")
const Admin = require("../models/admin");
const jwt = require("jsonwebtoken")

const verification = async (req, res, next) => {
    const { path } = req;
    const { token, api_key, authorization } = req.headers;
    if (path == "/library/home") {
        next();
    }//Check For Login request [No need of token as user logging in]
    else if (path == "/library/login") {
        //Check for api key
        if (api_key === process.env.API_KEY) {
            if (authorization) {
                const email = authorization.split(" ")[1];
                //Check is the user available for the given email if yes proceed next
                const admin = await Admin.findOne({ email: email });
                if (admin) {
                    next();
                } else {
                    console.log("Admin not found");
                    res.status(400).json({ message: "Admin not found" });
                }
            } else {
                console.log("Please Provide Authorization");
                res.status(400).json({ message: "Please Provide Authorization" });
            }

        } else {
            console.log("Invalid API key");
            res.status(400).json({ message: "Invalid api key" });
        }
    }//For request other than Login 
    else {
        //Check Api Key
        if (api_key == process.env.API_KEY) {
            //Check For Token
            if (token) {
                if (authorization) {
                    const email = authorization.split(" ")[1];
                    const admin = await Admin.findOne({ email: email });
                    if (admin) {
                        //Verify the  token is it valid or invalid
                        jwt.verify(token, process.env.JWT_SECRET,  (err, auth) => {
                            if (err) {
                                res.status(400).json({
                                    message: "Session Finished Please Login Again",
                                    validToken: false,
                                })
                            } else {
                                next();
                            }
                        })
                    }
                    else {
                        console.log("Admin not found");
                        res.status(400).json({
                            message: "Admin not found",
                            isAdmin: "false"
                        });
                    }
                } else {
                    console.log("Please Provide Authorization");
                    res.status(400).json({
                        message: "Please Provide Authorization",
                        isAdmin: "false"
                    });
                }

            } else {
                console.log("Token Not Provided");
                res.status(400).json({ message: "Token Not Provided" });
            }
        } else {
            console.log("Invalid API key ");
            res.status(403).json({ message: "Invalid api key " });
        }
    }
};

module.exports = { verification };
