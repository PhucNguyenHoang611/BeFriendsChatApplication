const mongoose = require("mongoose");
const Attachment = require("../models/attachment");
const ErrorResponse = require("../utils/errorResponse");

const firebaseStorage = require("../configuration/firebase");
const { ref, getDownloadURL } = require("firebase/storage");

exports.saveAttachments = async (req, res, next) => {
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

	try {
		const attachments = await Attachment.insertMany(attachmentsList);

		res.status(201).json({
			success: true,
			message: "Attachments uploaded successfully",
			data: attachments,
		});
	} catch (error) {
		next(error);
	}
};

exports.previewAttachment = async (req, res, next) => {
	const { attachmentId } = req.params;

	if (!attachmentId || !mongoose.Types.ObjectId.isValid(attachmentId))
        return next(new ErrorResponse("Please provide valid attachment's ID", 400));

	try {
		const attachment = await Attachment.findById(attachmentId);

		if (!attachment) return next(new ErrorResponse("No attachment found", 404));

		const attachmentURL = await getDownloadURL(ref(firebaseStorage, `attachments/${attachment.attachmentName}`));

		res.status(200).json({
			success: true,
			message: "Attachment URL",
			attachmentURL: attachmentURL
		});
	} catch (error) {
		next(error);
	}
};

exports.previewAttachmentInformation = async (req, res, next) => {
	const { attachmentId } = req.params;

	if (!attachmentId || !mongoose.Types.ObjectId.isValid(attachmentId))
		return next(new ErrorResponse("Please provide valid attachment's ID", 400));

	try {
		const attachment = await Attachment.findById(attachmentId);

		if (!attachment) return next(new ErrorResponse("No attachment found", 404));

		res.status(200).json({
			success: true,
            message: "Attachment information",
			data: attachment
		});
	} catch (error) {
		next(error);
	}
};