const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var conversationSchema = new Schema(
    {
        conversationName: {
            type: String,
            required: [true, "Please provide a conversation name"],
            trim: true
        }
    },
    { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;

/**
 * @swagger
 * components:
 *   schemas:
 *     Conversation:
 *       type: object
 *       required:
 *         - conversationName
 *       properties:
 *         conversationName:
 *           type: string
 */