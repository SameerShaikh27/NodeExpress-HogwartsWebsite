const jwt = require('jsonwebtoken');
const Register = require('../models/registry');

const auth = async (req, res, next) =>{
    try {
        
        // Fetching the token stored in a cookie with the help of (req.cookies.jwt).
        const token = req.cookies.jwt;

        // Verfying the user.
        // The two main argument that are require to verify the user are "Token" and the "Secret Key".
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY)

        // Not Of use (Delete Later till req.user=user;)
        const user = await Register.findOne({_id:verifyUser._id})

        req.token = token;
        req.user = user;

        // To move forward to another function.
        next();
    } 
    catch (error) {
        res.status(401).send(error)
    } 
}

module.exports = auth;