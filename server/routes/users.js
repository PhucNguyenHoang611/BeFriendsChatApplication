const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authentication");
const { register, login, changePassword } = require("../controllers/user/userAuthentication");
const { getCurrentUser, getAllUsers, getUserById, updateUser, uploadUserAvatar, deleteUserAvatar } = require("../controllers/user/userController");

const { uploadMemoryStorage } = require("../configuration/attachment");
const firebaseStorage = require("../configuration/firebase");
const { ref, uploadBytesResumable } = require("firebase/storage");

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     tags: [User Authentication]
 *     operatorId: register
 *     description: Register user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userEmail:
 *                 type: string
 *               userPassword:
 *                 type: string
 *               userFirstName:
 *                 type: string
 *               userLastName:
 *                 type: string
 *               userGender:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registered
 */
router.route("/register").post(register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags: [User Authentication]
 *     operatorId: login
 *     description: Login by user email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userEmail
 *               - userPassword
 *             properties:
 *              userEmail:
 *                 type: string
 *              userPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Invalid credentials
 */
router.route("/login").post(login);

/**
 * @swagger
 * /api/users/changePassword:
 *   put:
 *     tags: [User Authentication]
 *     operatorId: changePassword
 *     description: Change user's password
 *     security:
 *       - bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userOldPassword
 *               - userNewPassword
 *             properties:
 *               userOldPassword:
 *                 type: string
 *               userNewPassword:
 *                 type: string
 *     responses:
 *       201:
 *         description: Changed
 *       401:
 *         description: Invalid Credentials
 *       404:
 *         description: Not Found
 */
router.route("/changePassword").put(protect, changePassword);

/**
 * @swagger
 * /api/users/getCurrentUser:
 *   get:
 *     tags: [User]
 *     operatorId: getCurrentUser
 *     description: Get current user
 *     security:
 *       - bearer: []
 *     responses:
 *       200:
 *         description: Success
 */
router.route("/getCurrentUser").get(protect, getCurrentUser);

/**
 * @swagger
 * /api/users/getAllUsers:
 *   get:
 *     tags: [User]
 *     operatorId: getAllUsers
 *     description: Get all users
 *     security:
 *       - bearer: []
 *     responses:
 *       200:
 *         description: Success
 */
router.route("/getAllUsers").get(protect, getAllUsers);

/**
 * @swagger
 * /api/users/getUserById/{id}:
 *   get:
 *     tags: [User]
 *     operatorId: getUserById
 *     description: Get user by ID
 *     security:
 *       - bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */
router.route("/getUserById/:userId").get(protect, getUserById);

/**
 * @swagger
 * /api/users/updateUser:
 *   put:
 *     tags: [User]
 *     operatorId: updateUser
 *     description: Update user information
 *     security:
 *       - bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               userFirstName:
 *                 type: string
 *               userLastName:
 *                 type: string
 *               userGender:
 *                 type: string
 *     responses:
 *       201:
 *         description: Updated
 *       404:
 *         description: Not Found
 */
router.route("/updateUser").put(protect, updateUser);

/**
 * @swagger
 * /api/users/uploadUserAvatar:
 *   post:
 *     tags: [User Avatar]
 *     operatorId: uploadUserAvatar
 *     description: Upload user avatar
 *     security:
 *       - bearer: []
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
 *     responses:
 *       201:
 *         description: Saved
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */
router.route("/uploadUserAvatar").post(protect, uploadMemoryStorage.array("Files[]"), async (req, res, next) => {
    try {
        if (req.files && req.files.length === 1) {
            req.files.forEach((file) => {
                file.originalname = "user_" + file.originalname + "_" + Date.now();
                uploadBytesResumable(ref(firebaseStorage, `attachments/${file.originalname}`), file.buffer, { contentType: file.mimetype });
            });
        }
        next();
    } catch (error) {
        next(error);
    }
}, uploadUserAvatar);

/**
 * @swagger
 * /api/users/deleteUserAvatar:
 *   delete:
 *     tags: [User Avatar]
 *     operatorId: deleteUserAvatar
 *     description: Delete user avatar
 *     security:
 *       - bearer: []
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not Found
 */
router.route("/deleteUserAvatar").delete(protect, deleteUserAvatar);

module.exports = router;