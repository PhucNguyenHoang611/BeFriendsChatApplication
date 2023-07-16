const express = require("express");
const router = express.Router();

const { saveAttachments, previewAttachment, previewAttachmentInformation } = require("../controllers/attachmentController");

const { uploadMemoryStorage } = require("../configuration/attachment");
const firebaseStorage = require("../configuration/firebase");
const { ref, uploadBytesResumable } = require("firebase/storage");

/**
 * @swagger
 * /api/attachments/saveAttachments:
 *   post:
 *     tags: [Attachment]
 *     operatorId: saveAttachments
 *     description: Save attachments
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - Files[]
 *             properties:
 *               Files[]:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *
 *     responses:
 *       201:
 *         description: Upload Successful
 *       400:
 *         description: Bad Request
 *
 */
router.route("/saveAttachments").post(uploadMemoryStorage.array("Files[]"), async (req, res, next) => {
    try {
        if (req.files) {
            req.files.forEach((file) => {
                file.originalname = file.originalname + "_" + Date.now();
                uploadBytesResumable(ref(firebaseStorage, `attachments/${file.originalname}`), file.buffer, { contentType: file.mimetype });
            });
        }
        next();
    } catch (error) {
        next(error);
    }
}, saveAttachments);

/**
 * @swagger
 * /api/attachments/previewAttachment/{id}:
 *   get:
 *     tags: [Attachment]
 *     operatorId: previewAttachment
 *     description: Preview attachment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: Attachment ID
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not Found
 *
 */
router.route("/previewAttachment/:attachmentId").get(previewAttachment);

/**
 * @swagger
 * /api/attachments/previewAttachmentInformation/{id}:
 *   get:
 *     tags: [Attachment]
 *     operatorId: previewAttachmentInformation
 *     description: Preview attachment information
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: Attachment ID
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 *
 */
router.route("/previewAttachmentInformation/:attachmentId").get(previewAttachmentInformation);

module.exports = router;