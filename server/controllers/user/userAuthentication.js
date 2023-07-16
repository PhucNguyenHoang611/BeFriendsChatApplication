const mongoose = require("mongoose");
const User = require("../../models/user");

const ErrorResponse = require("../../utils/errorResponse");

exports.register = async (req, res, next) => {
    const { userEmail, userPassword, userFirstName, userLastName, userGender } = req.body;

    try {
        const user = await User.create({
            userEmail,
            userPassword,
            userFirstName,
            userLastName,
            userGender
        });

        sendJWT(user, 201, res)
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    const { userEmail, userPassword } = req.body;

    if (!userEmail || !userPassword)
        return next(new ErrorResponse("Please provide credentials", 400));

    try {
        const user = await User.findOne({ userEmail }).select("+userPassword");

        if (!user) return next(new ErrorResponse("Invalid credentials", 401));

        const validPassword = await user.checkUserPassword(userPassword);
        if (!validPassword) return next(new ErrorResponse("Incorrect password", 401));

        sendJWT(user, 200, res);
    } catch (error) {
        next(error);
    }
};

exports.changePassword = async (req, res, next) => {
    const currentUser = req.user;
    const { userOldPassword, userNewPassword } = req.body;

    try {
        const user = await User.findById(currentUser._id).select("+userPassword");

        if (!user) return next(new ErrorResponse("No user found", 404));

        const validPassword = await user.checkUserPassword(userOldPassword);
        if (!validPassword) return next(new ErrorResponse("Incorrect password", 401));

        await user.updateUserPassword(userNewPassword);

        res.status(201).json({
            success: true,
            message: "Change password successfully"
        });
    } catch (error) {
        next(error);
    }
};

const sendJWT = async (user, statusCode, res) => {
    res.status(statusCode).json({
        success: true,
        message: "Successfully",
        jsonWebToken: user.getSignedJWT()
    });
};