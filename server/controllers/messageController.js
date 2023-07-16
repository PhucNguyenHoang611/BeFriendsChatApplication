const mongoose = require("mongoose");
const Message = require("../models/message");

const ErrorResponse = require("../utils/errorResponse");

exports.getAllMessagesForConversation = async (req, res, next) => {
    const { conversationId } = req.params;

    if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId))
        return next(new ErrorResponse("Please provide valid conversation's ID", 400));

    try {
        const messages = await Message.find({
            messageConversation: conversationId
        });

        res.status(200).json({
            success: true,
            messages: "List of messages fetched successfully",
            data: messages
        });
    } catch (error) {
        next(error);
    }
};

exports.getMessageById = async (req, res, next) => {
    const { messageId } = req.params;

    if (!messageId || !mongoose.Types.ObjectId.isValid(messageId))
        return next(new ErrorResponse("Please provide valid message's ID", 400));

    try {
        const message = await Message.findById(messageId);

        if (!message) return next(new ErrorResponse("No message found", 404));

        res.status(200).json({
            success: true,
            message: "Get message successfully",
            data: message
        });
    } catch (error) {
        next(error);
    }
};

exports.createMessage = async (req, res, next) => {
    const { messageConversation, messageSender, messageText, messageSentDate } = req.body;

    if (!messageConversation || !mongoose.Types.ObjectId.isValid(messageConversation))
        return next(new ErrorResponse("Please provide valid conversation's ID", 400));

    if (!messageSender || !mongoose.Types.ObjectId.isValid(messageSender))
        return next(new ErrorResponse("Please provide valid sender's ID", 400));

    try {
        const message = await Message.create({
            messageConversation,
            messageSender,
            messageText,
            messageSentDate
        });

        res.status(201).json({
            success: true,
            message: "Create message successfully",
            data: message
        });
    } catch (error) {
        next(error);
    }
};

exports.updateMessage = async (req, res, next) => {
    const { messageId } = req.params;
    const { messageText } = req.body;

    if (!messageId || !mongoose.Types.ObjectId.isValid(messageId))
        return next(new ErrorResponse("Please provide valid message's ID", 400));

    try {
        const message = await Message.findByIdAndUpdate(messageId, {
            messageText
        });

        if (!message) return next(new ErrorResponse("No message found", 404));

        res.status(201).json({
            success: true,
            message: "Update message successfully",
            data: message
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteMessage = async (req, res, next) => {
    const { messageId } = req.params;

    if (!messageId || !mongoose.Types.ObjectId.isValid(messageId))
        return next(new ErrorResponse("Please provide valid message's ID", 400));

    try {
        const message = await Message.findByIdAndDelete(messageId);

        if (!message) return next(new ErrorResponse("No message found", 404));

        res.status(200).json({
            success: true,
            message: "Delete message successfully",
            data: message
        });
    } catch (error) {
        next(error);
    }
};