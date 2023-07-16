export const getAccessToken = (token) => ({
    headers: {
        Authorization: "Bearer " + token
    }
});

export const GET_CURRENT_USER = "/users/getCurrentUser";

export const LOGIN = "/users/login";

export const getLoginBody = (email, password) => ({
    userEmail: email,
    userPassword: password
});

export const REGISTER = "/users/register";

export const getRegisterBody = (email, password, firstName, lastName, gender) => ({
    userEmail: email,
    userPassword: password,
    userFirstName: firstName,
    userLastName: lastName,
    userGender: gender
});

// User
export const GET_ALL_USERS = "/users/getAllUsers";

export const UPLOAD_AVATAR = "/users/uploadUserAvatar";

export const UPDATE_USER = "/users/updateUser";

export const getUpdateUserBody = (firstName, lastName, gender) => ({
    userFirstName: firstName,
    userLastName: lastName,
    userGender: gender
});

// Conversation
export const GET_ALL_CONVERSATIONS_FOR_USER = "/conversations/getAllConversationsForUser";

export const CREATE_CONVERSATION = "/conversations/createConversation";

export const getCreateConversationBody = (conversationName) => ({
    conversationName: conversationName
});


// Conversation Members
export const GET_ALL_CONVERSATION_MEMBERS = (id) => `/conversations/getAllConversationMembers/${id}`;

export const CREATE_CONVERSATION_MEMBER = "/conversations/createConversationMember";

export const getCreateConversationMemberBody = (conversationId, userId) => ({
    conversationId: conversationId,
    userId: userId,
    userJoinedDate: new Date()
});

// Message
export const GET_ALL_MESSAGES_FOR_CONVERSATION = (id) => `/messages/getAllMessagesForConversation/${id}`;

export const CREATE_MESSAGE = "/messages/createMessage";

export const getCreateMessageBody = (messageConversation, messageSender, messageText, messageSentDate) => ({
    messageConversation: messageConversation,
    messageSender: messageSender,
    messageText: messageText,
    messageSentDate: messageSentDate
});

// Attachment
export const PREVIEW_ATTACHMENT = (id) => `/attachments/previewAttachment/${id}`;