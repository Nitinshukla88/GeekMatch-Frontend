import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";

const Chat = () => {
  const { targetUserId } = useParams();

  const [messages, setMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState("");

  const loggedInUser = useSelector((store) => store?.user);

  const { _id, firstName } = loggedInUser || {};

  useEffect(() => {
    if (!_id) return;
    const socket = createSocketConnection();

    socket.emit("joinChat", { firstName, _id, targetUserId });

    socket.on("messageReceived", ({ firstName, chatMessage }) => {
      console.log(firstName + " " + chatMessage);
      setMessages((messages) => [...messages, { firstName, chatMessage }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [_id, targetUserId]);

  const sendChatMessage = () => {
    const socket = createSocketConnection();

    socket.emit("sendMessage", { firstName, _id, targetUserId, chatMessage });
    setChatMessage("");
  };

  return (
    <div className="flex justify-center my-10">
      <div className="border-2 border-gray-300 w-[60vw] h-[30vw] rounded-lg">
        <h1 className="text-center my-2 text-3xl font-semibold">Chat</h1>
        <div className="h-[20vw] border-2 border-red-400 overflow-scroll p-5">
          {messages.map((message, index) => {
            return message?.firstName === loggedInUser?.firstName ? (
              <div className="chat chat-end">
                <div className="chat-bubble chat-bubble-info">
                  {message?.firstName + " - " + message?.chatMessage}
                </div>
              </div>
            ) : (
              <div className="chat chat-start" key={index}>
                <div className="chat-bubble chat-bubble-primary">
                  {message?.firstName + " - " + message?.chatMessage}
                </div>
              </div>
            );
          })}
        </div>
        <input
          className="py-3 w-4/5 mx-6 px-4 my-6"
          type="text"
          placeholder="Type message..."
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
        ></input>
        <button className="btn btn-secondary" onClick={sendChatMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
