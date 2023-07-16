const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/user");

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token)
        return next(new ErrorResponse("Unauthorized user!", 401));

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.id || !mongoose.Types.ObjectId.isValid(decoded.id))
            return next(new ErrorResponse("Unauthorized user!", 401));

        const user = await User.findById(decoded.id);

        if (!user) return next(new ErrorResponse("Unauthorized user!", 401));

        // Send current user
        req.user = user;
        next();
    } catch (error) {
        return next(new ErrorResponse(error));
    }
};