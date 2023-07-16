const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authentication");
const { getAllConversationsForUser, getConversationById, createConversation, updateConversation, deleteConversation,
    getAllConversationMembers, getConversationMemberById, createConversationMember, deleteConversationMember } = require("../controllers/conversationController");

/**
 * @swagger
 * /api/conversations/getAllConversationsForUser:
 *   get:
 *     tags: [Conversation]
 *     operatorId: getAllConversationsForUser
 *     description: Get all conversations for user
 *     security:
 *       - bearer: []
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not Found
 */
router.route("/getAllConversationsForUser").get(protect, getAllConversationsForUser);

/**
 * @swagger
 * /api/conversations/getConversationById/{id}:
 *   get:
 *     tags: [Conversation]
 *     operatorId: getConversationById
 *     description: Get conversation by ID
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
 *       404:
 *         description: Not Found
 */
router.route("/getConversationById/:conversationId").get(protect, getConversationById);

/**
 * @swagger
 * /api/conversations/createConversation:
 *   post:
 *     tags: [Conversation]
 *     operatorId: createConversation
 *     description: Create conversation
 *     security:
 *       - bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               conversationName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.route("/createConversation").post(protect, createConversation);

/**
 * @swagger
 * /api/conversations/updateConversation/{id}:
 *   put:
 *     tags: [Conversation]
 *     operatorId: updateConversation
 *     description: Update conversation
 *     security:
 *       - bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: Conversation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               conversationName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Updated
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */
router.route("/updateConversation/:conversationId").put(protect, updateConversation);

/**
 * @swagger
 * /api/conversations/deleteConversation/{id}:
 *   delete:
 *     tags: [Conversation]
 *     operatorId: deleteConversation
 *     description: Delete conversation
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
 *       404:
 *         description: Not Found
 */
router.route("/deleteConversation/:conversationId").delete(protect, deleteConversation);

/**
 * @swagger
 * /api/conversations/getAllConversationMembers/{id}:
 *   get:
 *     tags: [Conversation Member]
 *     operatorId: getAllConversationMembers
 *     description: Get all conversation members
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
 *       404:
 *         description: Not Found
 */
router.route("/getAllConversationMembers/:conversationId").get(protect, getAllConversationMembers);

/**
 * @swagger
 * /api/conversations/getConversationMemberById/{id}:
 *   get:
 *     tags: [Conversation Member]
 *     operatorId: getConversationMemberById
 *     description: Get conversation member by ID
 *     security:
 *       - bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: Conversation Member ID
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */
router.route("/getConversationMemberById/:conversationMemberId").get(protect, getConversationMemberById);

/**
 * @swagger
 * /api/conversations/createConversationMember:
 *   post:
 *     tags: [Conversation Member]
 *     operatorId: createConversationMember
 *     description: Create conversation member
 *     security:
 *       - bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               conversationId:
 *                 type: string
 *               userId:
 *                 type: string
 *               userJoinedDate:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 */
router.route("/createConversationMember").post(protect, createConversationMember);

/**
 * @swagger
 * /api/conversations/deleteConversationMember/{id}:
 *   put:
 *     tags: [Conversation Member]
 *     operatorId: deleteConversationMember
 *     description: Delete conversation member
 *     security:
 *       - bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: Conversation Member ID
 *     responses:
 *       200:
 *         description: Deleted
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */
router.route("/deleteConversationMember/:conversationMemberId").delete(protect, deleteConversationMember);

module.exports = router;