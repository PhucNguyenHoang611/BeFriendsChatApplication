const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var conversationMemberSchema = new Schema(
    {
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: [true, "Please provide conversation's ID"],
            trim: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Please provide user's ID"],
            trim: true
        },
        userJoinedDate: {
            type: Date,
            default: new Date()
        }
    },
    { timestamps: true }
);

const ConversationMember = mongoose.model("ConversationMember", conversationMemberSchema);
module.exports = ConversationMember;

/**
 * @swagger
 * components:
 *   schemas:
 *     ConversationMember:
 *       type: object
 *       required:
 *         - conversationId
 *         - userId
 *       properties:
 *         conversationId:
 *           type: string
 *         userId:
 *           type: string
 *         userJoinedDate:
 *           type: string
 */