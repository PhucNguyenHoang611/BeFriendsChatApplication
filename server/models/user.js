const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

var userSchema = new Schema(
    {
        userEmail: {
            type: String,
            required: [true, "Please provide user's email"],
            unique: [true, "Email is already registered"],
            match: [
                /^[a-z0-9_\.]{1,32}@[a-z0-9]{2,10}(\.[a-z0-9]{2,10}){1,}$/,
                "Invalid email",
            ],
            trim: true
        },
        userPassword: {
            type: String,
            required: [true, "Please provide user's password"],
            minlength: [6, "Password must have at least 6 characters"],
            select: false,
            trim: true
        },
        userFirstName: {
            type: String,
            match: [
                /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/,
                "Invalid first name",
            ],
            required: [true, "Please provide user's first name"],
            trim: true
        },
        userLastName: {
            type: String,
            match: [
                /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/,
                "Invalid last name",
            ],
            required: [true, "Please provide user's last name"],
            trim: true
        },
        userGender: {
            type: String,
            trim: true
        },
        userAvatar: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Attachment",
            default: null,
			trim: true
        }
    },
    { timestamps: true }
);

// Encrypt password before save
userSchema.pre("save", async function (next) {
    if (!this.isModified("userPassword")) next();

    const salt = await bcrypt.genSalt(10);
    this.userPassword = await bcrypt.hash(this.userPassword, salt);
    next();
});

// Check user password
userSchema.methods.checkUserPassword = async function (userPassword) {
    return await bcrypt.compare(userPassword, this.userPassword);
};

// Update user password
userSchema.methods.updateUserPassword = async function (userPassword) {
    this.userPassword = userPassword;
    await this.save();
};

// Get JSON Web Token
userSchema.methods.getSignedJWT = function () {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

const User = mongoose.model("User", userSchema);
module.exports = User;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - userEmail
 *         - userPassword
 *         - userFirstName
 *         - userLastName
 *       properties:
 *         userEmail:
 *           type: string
 *         userPassword:
 *           type: string
 *         userFirstName:
 *           type: string
 *         userLastName:
 *           type: string
 *         userGender:
 *           type: string
 *         userAvatar:
 *           type: string
 */