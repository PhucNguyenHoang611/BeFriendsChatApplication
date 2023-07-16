const mongoose = require("mongoose");
const User = require("../../models/user");
const Conversation = require("../../models/conversation/conversation");
const ConversationMember = require("../../models/conversation/conversationMember");
const Attachment = require("../../models/attachment");

const ErrorResponse = require("../../utils/errorResponse");

const firebaseStorage = require("../../configuration/firebase");
const { ref, deleteObject } = require("firebase/storage");

exports.getCurrentUser = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            message: "Get current user successfully",
            data: req.user
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllUsers = async (req, res, next) => {
    const currentUser = req.user;

    try {
        const users = await User.find({
            _id: { $ne: currentUser._id }
        });

        const conversations = await ConversationMember.find({
            userId: currentUser._id,
        });

        let temp = [];
        let filteredUsers = [];

        await Promise.all(conversations.map(async (item) => {
            const member = await ConversationMember.findOne({
                conversationId: item.conversationId,
                userId: { $ne: item.userId }
            });
            
            const user = await User.findById(member.userId);

            temp.push(user);
        }));

        for (let i = 0; i < users.length; i++) {
            let notInArray = true;

            for (let j = 0; j < temp.length; j++) {
                if (users[i].userEmail === temp[j].userEmail) {
                    notInArray = false;
                }
            }

            if (notInArray) filteredUsers.push(users[i]);
        }

        res.status(200).json({
            success: true,
            message: "List of users fetched successfully",
            data: filteredUsers
        });
    } catch (error) {
        next(error);
    }
};

exports.getUserById = async (req, res, next) => {
    const { userId } = req.params;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId))
        return next(new ErrorResponse("Please provide valid user's ID", 400));

    try {
        const user = await User.findById(userId);

        if (!user) return next(new ErrorResponse("No user found", 404));

        res.status(200).json({
            success: true,
            message: "Get user successfully",
            data: user
        });
    } catch (error) {
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    const currentUser = req.user;
    const { userFirstName, userLastName, userGender } = req.body;

    try {
        const user = await User.findByIdAndUpdate(currentUser._id, {
            userFirstName,
            userLastName,
            userGender
        });

        if (user) {
            res.status(201).json({
                success: true,
                message: "Update user successfully",
                data: user
            });
        } else {
            return next(new ErrorResponse("User not found", 404));
        }
    } catch (error) {
        next(error);
    }
};

exports.uploadUserAvatar = async (req, res, next) => {
    const currentUser = req.user;

    let attachmentsList = req.files
		? req.files.map((file) => {
				return {
					attachmentMimeType: file.mimetype,
					attachmentName: file.originalname,
					attachmentSize: file.size,
				};
		  })
		: [];

    if (!attachmentsList.length)
		return next(new ErrorResponse("No attachment added", 404));

    if (attachmentsList.length > 1)
		return next(new ErrorResponse("Only one attachment can be uploaded", 400));

    try {
        const attachments = await Attachment.insertMany(attachmentsList);

        const user = await User.findByIdAndUpdate(currentUser._id, {
            userAvatar: attachments[0]._id.toString()
        });
        
        if (!user) return next(new ErrorResponse("No user found", 404));

        res.status(201).json({
            success: true,
            message: "Upload user avatar successfully",
            data: user
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteUserAvatar = async (req, res, next) => {
    const currentUser = req.user;

    try {
        const attachment = await Attachment.findByIdAndDelete(currentUser.userAvatar);

        if (!attachment) return next(new ErrorResponse("No avatar found", 404));

        await deleteObject(ref(firebaseStorage, `attachments/${attachment.attachmentName}`));

        await User.findByIdAndUpdate(currentUser._id, {
            userAvatar: null
        });

        res.status(200).json({
            success: true,
            message: "Delete user avatar successfully"
        });
    } catch (error) {
        next(error);
    }
};