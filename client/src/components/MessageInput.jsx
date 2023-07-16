import { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { FaceSmileIcon } from "@heroicons/react/20/solid";
import EmojiPicker from 'emoji-picker-react';

/* eslint-disable react/prop-types */
const MessageInput = ({ sendMessage }) => {
    const [message, setMessage] = useState("");
    const [showIcon, setShowIcon] = useState(false);

    const sendMsg = (event) => {
        event.preventDefault();

        if (message.length > 0) {
            sendMessage(message);
            setMessage("");
        }
    }

    const handleChangeEmoji = (emojiData) => {
        let msg = message;
        msg += emojiData.emoji;
        setMessage(msg);
    }

    return (
        <div className="input-container">
            <div className="input-icon">
                <FaceSmileIcon className="h-8 w-8 text-yellow-500 cursor-pointer" onClick={() => setShowIcon(!showIcon)} />
                {showIcon && (
                    <EmojiPicker onEmojiClick={handleChangeEmoji} />
                )}
            </div>
            <form className="input-text" onSubmit={((event) => sendMsg(event))}>
                <input
                    className="focus-visible:outline-none"
                    type="text"
                    placeholder="Type your message here..."
                    value={message}
                    onFocus={() => setShowIcon(false)}
                    onChange={(event) => setMessage(event.target.value)} />
                <button type="submit"> 
                    <PaperAirplaneIcon className="h-8 w-8 input-send" />
                </button>
            </form>
        </div>
    )
}

export default MessageInput;