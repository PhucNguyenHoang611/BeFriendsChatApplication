const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var attachmentSchema = new Schema(
    {
        attachmentMimeType: {
            type: String,
            required: [true, "Please provide attachment MIME type"],
            trim: true
        },
        attachmentName: {
            type: String,
            required: [true, "Please provide attachment's name"],
            trim: true
        },
        attachmentSize: {
            type: Number,
            required: [true, "Please provide attachment's size"]
        }
    },
    { timestamps: true }
);

const Attachment = mongoose.model("Attachment", attachmentSchema);
module.exports = Attachment;

/**
 * @swagger
 * components:
 *   schemas:
 *     Attachment:
 *       type: object
 *       required:
 *         - attachmentMimeType
 *         - attachmentName
 *         - attachmentSize
 *       properties:
 *         attachmentMimeType:
 *           type: string
 *         attachmentName:
 *           type: string
 *         attachmentSize:
 *           type: number
 */