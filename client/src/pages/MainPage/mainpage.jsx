import MessageBox from "../../components/MessageBox";
import ConversationsList from "../../components/ConversationsList";
import "./mainpage.css"

import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client"
import { useSelector } from "react-redux";
import { hostURL } from "../../api/mainApi";

const MainPage = () => {
    const socket = useRef();
    const [currentConversation, setCurrentConversation] = useState(null);
    const currentUser = useSelector((state) => state.auth.currentUser);


    const handleChangeConversation = (conversation) => {
        setCurrentConversation(conversation);
    }

    useEffect(() => {
        if (currentUser.id) {
            if (currentConversation) {
                socket.current = io(hostURL);
                socket.current.emit("addUser", currentUser.id);
            }
        }
    }, [currentUser, currentConversation]);

    return (
        <div className="main-container">
            <div className="chat-container">
                <ConversationsList handleChange={handleChangeConversation} />
                {currentConversation ? (
                    <MessageBox conversation={currentConversation} socket={socket} />
                ) : (
                    <div className="w-full h-full flex justify-center items-center font-bold text-center">Select a conversation to start</div>
                )}
            </div>
        </div>
    )
}

export default MainPage;