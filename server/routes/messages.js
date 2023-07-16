const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authentication");
const { getAllMessagesForConversation, getMessageById, createMessage, updateMessage, deleteMessage } = require("../controllers/messageController");

/**
 * @swagger
 * /api/messages/getAllMessagesForConversation/{id}:
 *   get:
 *     tags: [Message]
 *     operatorId: getAllMessagesForConversation
 *     description: Get all messages for conversation
 *     security:
 *       - bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: Conversation ID
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad Request
 */
router.route("/getAllMessagesForConversation/:conversationId").get(protect, getAllMessagesForConversation);

/**
 * @swagger
 * /api/messages/getMessageById/{id}:
 *   get:
 *     tags: [Message]
 *     operatorId: getMessageById
 *     description: Get message by ID
 *     security:
 *       - bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: Message ID
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */
router.route("/getMessageById/:messageId").get(protect, getMessageById);

/**
 * @swagger
 * /api/messages/createMessage:
 *   post:
 *     tags: [Message]
 *     operatorId: createMessage
 *     description: Create message
 *     security:
 *       - bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               messageConversation:
 *                 type: string
 *               messageSender:
 *                 type: string
 *               messageText:
 *                 type: string
 *               messageSentDate:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 */
router.route("/createMessage").post(protect, createMessage);

/**
 * @swagger
 * /api/messages/updateMessage/{id}:
 *   put:
 *     tags: [Message]
 *     operatorId: updateMessage
 *     description: Update message
 *     security:
 *       - bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: Message ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               messageText:
 *                 type: string
 *     responses:
 *       201:
 *         description: Updated
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */
router.route("/updateMessage/:messageId").put(protect, updateMessage);

/**
 * @swagger
 * /api/messages/deleteMessage/{id}:
 *   delete:
 *     tags: [Message]
 *     operatorId: deleteMessage
 *     description: Delete message
 *     security:
 *       - bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: Message ID
 *     responses:
 *       200:
 *         description: Deleted
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */
router.route("/deleteMessage/:messageId").delete(protect, deleteMessage);

module.exports = router;