const mongoose = require("mongoose");
const Conversation = require("../models/conversation/conversation");
const ConversationMember = require("../models/conversation/conversationMember");
const Message = require("../models/message");
const User = require("../models/user");

const ErrorResponse = require("../utils/errorResponse");

exports.getAllConversationsForUser = async (req, res, next) => {
    const currentUser = req.user;

    try {
        const members = await ConversationMember.find({
            userId: currentUser._id
        });
        
        if (members.length > 0) {
            let result = [];

            await Promise.all(members.map(async (item) => {
                const conversation = await Conversation.findById(item.conversationId);

                result.push(conversation);
            }));

            let finalResult = [];

            await Promise.all(result.map(async (item) => {
                const membersList = await ConversationMember.find({
                    conversationId: item._id
                });

                await Promise.all(membersList.map(async (mem) => {
                    if (mem.userId.toString() !== currentUser._id.toString()) {
                        const user = await User.findById(mem.userId);
                        finalResult.push({ conversation: item, member: mem, user });
                    }
                }));
            }));

            res.status(200).json({
                success: true,
                message: "List of conversations fetched successfully",
                data: finalResult
            });
        } else
            return next(new ErrorResponse("No conversation found", 404));
    } catch (error) {
        next(error);
    }
};

exports.getConversationById = async (req, res, next) => {
    const { conversationId } = req.params;

    if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId))
        return next(new ErrorResponse("Please provide valid conversation's ID", 400));

    try {
        const conversation = await Conversation.findById(conversationId);

        if (!conversation) return next(new ErrorResponse("No conversation found", 404));

        res.status(200).json({
            success: true,
            message: "Get conversation successfully",
            data: conversation
        });
    } catch (error) {
        next(error);
    }
};

exports.createConversation = async (req, res, next) => {
    const { conversationName } = req.body;

    try {
        const conversation = await Conversation.create({
            conversationName
        });

        res.status(201).json({
            success: true,
            message: "Create conversation successfully",
            data: conversation
        });
    } catch (error) {
        next(error);
    }
};

exports.updateConversation = async (req, res, next) => {
    const { conversationId } = req.params;

    if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId))
        return next(new ErrorResponse("Please provide valid conversation's ID", 400));

    const { conversationName } = req.body;

    try {
        const conversation = await Conversation.findByIdAndUpdate(conversationId, {
            conversationName
        });

        if (!conversation) return next(new ErrorResponse("No conversation found", 404));

        res.status(201).json({
            success: true,
            message: "Update conversation successfully",
            data: conversation
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteConversation = async (req, res, next) => {
    const { conversationId } = req.params;

    if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId))
        return next(new ErrorResponse("Please provide valid conversation's ID", 400));

    try {
        const conversation = await Conversation.findByIdAndDelete(conversationId);

        if (!conversation) return next(new ErrorResponse("No conversation found", 404));

        await ConversationMember.deleteMany({
            conversationId: conversationId
        });

        await Message.deleteMany({
            messageConversation: conversationId
        });

        res.status(200).json({
            success: true,
            message: "Delete conversation successfully",
            data: conversation
        });
    } catch (error) {
        next(error);
    }
};

// Conversation Member
exports.getAllConversationMembers = async (req, res, next) => {
    const { conversationId } = req.params;

    if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId))
        return next(new ErrorResponse("Please provide valid conversation's ID", 400));

    try {
        const members = await ConversationMember.find({
            conversationId: conversationId
        });

        if (members.length > 0) {
            res.status(200).json({
                success: true,
                message: "List of members fetched successfully",
                data: members
            });
        } else
            return next(new ErrorResponse("No member found", 404));
    } catch (error) {
        next(error);
    }
};

exports.getConversationMemberById = async (req, res, next) => {
    const { conversationMemberId } = req.params;

    if (!conversationMemberId || !mongoose.Types.ObjectId.isValid(conversationMemberId))
        return next(new ErrorResponse("Please provide valid conversation member's ID", 400));

    try {
        const member = await ConversationMember.findById(conversationMemberId);

        if (!member) return next(new ErrorResponse("No member found", 404));

        const user  = await User.findById(member.userId);

        if (!user) return next(new ErrorResponse("No user found", 404));

        res.status(200).json({
            success: true,
            message: "Get conversation member successfully",
            member: member,
            memberInformation: user
        });
    } catch (error) {
        next(error);
    }
};

exports.createConversationMember = async (req, res, next) => {
    const { conversationId, userId, userJoinedDate } = req.body;

    if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId))
        return next(new ErrorResponse("Please provide valid conversation's ID", 400));

    if (!userId || !mongoose.Types.ObjectId.isValid(userId))
        return next(new ErrorResponse("Please provide valid user's ID", 400));

    try {
        const member = await ConversationMember.create({
            conversationId,
            userId,
            userJoinedDate
        });

        res.status(201).json({
            success: true,
            message: "Create conversation member successfully",
            data: member
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteConversationMember = async (req, res, next) => {
    const { conversationMemberId } = req.params;

    if (!conversationMemberId || !mongoose.Types.ObjectId.isValid(conversationMemberId))
        return next(new ErrorResponse("Please provide valid conversation member's ID", 400));

    try {
        const member = await ConversationMember.findByIdAndDelete(conversationMemberId);

        if (!member) return next(new ErrorResponse("No member found", 404));

        await Message.deleteMany({
            messageConversation: member.conversationId,
            messageSender: member.userId
        });

        res.status(200).json({
            success: true,
            message: "Delete conversation member successfully",
            data: member
        });
    } catch (error) {
        next(error);
    }
};