/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import { mainApi } from '../api/mainApi'
import * as apiEndpoints from '../api/apiEndpoints'
import MessageInput from './MessageInput'

const MessageBox = ({ conversation, socket }) => {
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const currentUser = useSelector((state) => state.auth.currentUser);
    const scrollRef = useRef()

    const getAllMessages = async () => {
        try {
            const result = await mainApi.get(
                apiEndpoints.GET_ALL_MESSAGES_FOR_CONVERSATION(conversation.conversation._id),
                apiEndpoints.getAccessToken(currentUser.token)
            );

            setMessages(result.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleSendMessage = async (msg) => {
        try {
            await mainApi.post(
                apiEndpoints.CREATE_MESSAGE,
                apiEndpoints.getCreateMessageBody(conversation.conversation._id, currentUser.id, msg, new Date()),
                apiEndpoints.getAccessToken(currentUser.token)
            );

            socket.current.emit("sendMessage", {
                user: {
                    conversationId: conversation.conversation._id,
                    userId: conversation.user._id
                },
                messageSender: currentUser.id,
                messageText: msg
            });

            const msgs = [...messages];

            msgs.push({ messageSender: currentUser.id, messageText: msg });
            setMessages(msgs);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (socket.current) {
            socket.current.on("receiveMessage", (sender, text) => {
                setArrivalMessage({ messageSender: sender, messageText: text });
            });
        }
    }, [socket.current]);

    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    useEffect(() => {
        if (currentUser.id) {
            getAllMessages();
        }
    }, [currentUser, conversation]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="message-container">
            <div className="message-header">
                <div className="message-avatar">
                    <img alt="logo" src={conversation.avatarURL} />
                </div>
                <p className="whitespace-nowrap ml-4 font-bold text-black">{conversation.user.userFirstName + " " + conversation.user.userLastName}</p>
            </div>
            <div className="message-box">
                {messages.map((message, index) => {
                    return (
                        <div ref={scrollRef} key={index} className={`message ${message.messageSender === currentUser.id ? "sended" : "received"}`}>
                            <p className="msg-text">{message.messageText}</p>
                        </div>
                    )
                })}
            </div>
            <div className="message-input">
                <MessageInput sendMessage={handleSendMessage} />
            </div>
        </div>
    )
}

export default MessageBox;