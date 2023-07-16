/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Modal, Box, Typography, IconButton } from "@mui/material"
import { XMarkIcon } from "@heroicons/react/24/outline"

import { mainApi } from '../../api/mainApi'
import * as apiEndpoints from '../../api/apiEndpoints'

const AddConversationModal = ({ isModalOpen, setIsModalOpen, currentUser, getAllConversationsForUser }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [allUsersForSearch, setAllUsersForSearch] = useState([]);

    const getAllUsers = async() => {
        try {
            const usersList = await mainApi.get(
                apiEndpoints.GET_ALL_USERS,
                apiEndpoints.getAccessToken(currentUser.token)
            );

            await Promise.all(usersList.data.data.map(async (user) => {
                if (user.userAvatar) {
                    const avaURL = await mainApi.get(
                        apiEndpoints.PREVIEW_ATTACHMENT(user.userAvatar)
                    );
                    
                    setAllUsers((prev) => [ ...prev, { user, userAvatar: avaURL.data.attachmentURL } ]);
                    setAllUsersForSearch((prev) => [ ...prev, { user, userAvatar: avaURL.data.attachmentURL } ]);
                } else {
                    setAllUsers((prev) => [ ...prev, { user, userAvatar: "https://img.freepik.com/free-icon/user_318-159711.jpg" } ]);
                    setAllUsersForSearch((prev) => [ ...prev, { user, userAvatar: "https://img.freepik.com/free-icon/user_318-159711.jpg" } ]);
                }

            }));
        } catch (error) {
            console.log(error);
        }
    }

    const handleAddConversation = async (user) => {
        try {
            if (user) {
                const conversation = await mainApi.post(
                    apiEndpoints.CREATE_CONVERSATION,
                    apiEndpoints.getCreateConversationBody(user.user.userFirstName),
                    apiEndpoints.getAccessToken(currentUser.token)
                );

                await mainApi.post(
                    apiEndpoints.CREATE_CONVERSATION_MEMBER,
                    apiEndpoints.getCreateConversationMemberBody(conversation.data.data._id, currentUser.id),
                    apiEndpoints.getAccessToken(currentUser.token)
                )

                await mainApi.post(
                    apiEndpoints.CREATE_CONVERSATION_MEMBER,
                    apiEndpoints.getCreateConversationMemberBody(conversation.data.data._id, user.user._id),
                    apiEndpoints.getAccessToken(currentUser.token)
                )
            }

            getAllConversationsForUser();
            handleClose();
        } catch (error) {
            console.log(error);
        }
    }

    const handleSearch = (event) => {
        if (event.target.value == "") {
            setAllUsers(allUsersForSearch);
        } else {
            setAllUsers(allUsersForSearch);
            setAllUsers((prev) => {
                const filtered = prev.filter((user) => {
                    if ((user.user.userFirstName + " " + user.user.userLastName).toLowerCase().includes(event.target.value.toLowerCase()))
                        return user;
                });

                return filtered;
            });
        }
    }

    const handleClose = () => {
        setIsModalOpen(false);
    }

    useEffect(() => {
        if (isModalOpen) {
            getAllUsers();
        } else {
            setAllUsers([]);
            setAllUsersForSearch([]);
        }
    }, [isModalOpen]);

    return (
        <React.Fragment>
			<Modal
				open={isModalOpen}
				onClose={handleClose}>
				<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					backgroundColor: "white",
					padding: "1.5rem",
					width: "30%",
					height: "70%",
					overflowY: "auto" }}>
					<Box width="100%" height="10%" display="flex" alignItems="center" justifyContent="space-between">
                        <Typography sx={{
                            fontWeight: "bold",
                            fontSize: "1.5rem",
                            color: "black"
                        }}>
                            Find your friends
						</Typography>
						<IconButton size="small" onClick={handleClose}>
							<XMarkIcon className="w-5 h-5 text-black" />
						</IconButton>
					</Box>
					<Box width="100%" height="90%">
                        <Box className="my-6">
                            <input onChange={handleSearch} placeholder="Enter username" className="w-full p-4 focus-visible:outline-none border-2 border-black rounded-xl" />
                        </Box>
                        {allUsers?.map((user, index) => (
                            <Box key={index} className="flex justify-between items-center my-6">
                                <div className="flex justify-start items-center gap-2">
                                    <div className="conversation-avatar">
                                        <img alt="logo" src={user.userAvatar} />
                                    </div>
                                    <p>{user.user.userFirstName + " " + user.user.userLastName}</p>
                                </div>
                                <button className="cursor-pointer rounded-xl bg-yellow-500 p-2" onClick={() => handleAddConversation(user)}>Chat</button>
                            </Box>
                        ))}
                        {allUsers.length === 0 && (
                            <div className="w-full text-center">No user found</div>
                        )}
                    </Box>
                </Box>
            </Modal>
        </React.Fragment>
    )
}

export default AddConversationModal