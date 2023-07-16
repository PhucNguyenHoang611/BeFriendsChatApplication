const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var messageSchema = new Schema(
    {
        messageConversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: [true, "Please provide conversation's ID"],
            trim: true
        },
        messageSender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Please provide sender's ID"],
            trim: true
        },
        messageText: {
            type: String,
            required: [true, "Please provide message text"],
            trim: true
        },
        messageSentDate: {
            type: Date,
            default: new Date()
        }
    },
    { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - messageConversation
 *         - messageSender
 *         - messageText
 *       properties:
 *         messageConversation:
 *           type: string
 *         messageSender:
 *           type: string
 *         messageText:
 *           type: string
 */