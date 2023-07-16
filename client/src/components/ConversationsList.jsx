/* eslint-disable react/prop-types */
/* eslint-disable no-empty */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAllConversations } from "../redux/reducers/conversationReducer"
import { logout } from "../redux/reducers/authReducer"

import { mainApi } from '../api/mainApi'
import * as apiEndpoints from '../api/apiEndpoints'
import { useEffect } from 'react'

import { PowerIcon, PlusIcon } from "@heroicons/react/24/outline"
import AddConversationModal from './modals/AddConversationModal'

const ConversationsList = ({ handleChange }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [conversations, setConversations] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedConversation, setSelectedConversation] = useState(-1);
    const currentUser = useSelector((state) => state.auth.currentUser);
    const allConversations = useSelector((state) => state.conversation.allConversations);

    const getAllConversationsForUser = async () => {
        try {
            const result = await mainApi.get(
                apiEndpoints.GET_ALL_CONVERSATIONS_FOR_USER,
                apiEndpoints.getAccessToken(currentUser.token)
            );

            const finalResult = await Promise.all(result.data.data.map(async (data) => {
                if (data.user.userAvatar) {
                    const ava = await mainApi.get(
                        apiEndpoints.PREVIEW_ATTACHMENT(data.user.userAvatar)
                    );

                    return { ...data, avatarURL: ava.data.attachmentURL };
                } else
                    return { ...data, avatarURL: "https://img.freepik.com/free-icon/user_318-159711.jpg" };
            }));

            setConversations(finalResult);
            dispatch(getAllConversations(finalResult));
        } catch (error) {
            console.log(error);
        }
    }

    const handleChangeConversation = (conversation, index) => {
        setSelectedConversation(index);
        handleChange(conversation);
    }

    const handleChangeInformation = () => {
        navigate("/information");
    }

    const handleLogout = () => {
        dispatch(logout());
        dispatch(getAllConversations([]));
        localStorage.clear();
        navigate("/login");
    }

    useEffect(() => {
        if (currentUser.id) {
            if (allConversations.length > 0)
                setConversations(allConversations);
            else
                getAllConversationsForUser();
        }
    }, [currentUser]);

    useEffect(() => {

    }, [conversations]);
    
    return (
        <div className="conversation-container">
            <div className="conversation-logo">
                <img alt="logo" src="public/befriends_logo.png" style={{ width: "auto", height: "100%"}} />
                <button  onClick={() => setOpenModal(true)}><PlusIcon className="h-5 w-5 stroke-2 text-black" /></button>
                <AddConversationModal isModalOpen={openModal} setIsModalOpen={setOpenModal} currentUser={currentUser} getAllConversationsForUser={getAllConversationsForUser} />
            </div>
            <div className="conversation-list">
                {conversations.map((conversation, index) => {
                    return (
                        <div key={index}
                            className={`conversation-contact ${ index === selectedConversation ? "selected" : "" }`}
                            onClick={() => handleChangeConversation(conversation, index)}>
                            <div className="conversation-avatar" >
                                <img alt="avatar" src={conversation.avatarURL} />    
                            </div>
                            <p className="w-full ml-4 whitespace-nowrap">{conversation.user.userFirstName + " " + conversation.user.userLastName}</p>
                        </div>
                    )
                })}
            </div>
            <div className="personal-info">
                <div className="conversation-avatar cursor-pointer" onClick={handleChangeInformation}>
                    <img alt="logo" src={currentUser.avatar} />
                </div>
                <p className="whitespace-nowrap font-bold text-white">{currentUser.firstName + " " + currentUser.lastName}</p>
                <button className="bg-red-600 p-1 rounded-lg" onClick={handleLogout}><PowerIcon className="h-5 w-5 stroke-2 text-white" /></button>
            </div>
        </div>
    )
}

export default ConversationsList;