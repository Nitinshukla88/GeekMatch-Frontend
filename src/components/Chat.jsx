import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/appStoreSlices/userSlice";
import { addConnections } from "../utils/appStoreSlices/connectionSlice";
import Loader from "./Loader";

const Chat = () => {
  const { targetUserId } = useParams();

  const [messages, setMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState("");

  const loggedInUser = useSelector((store) => store?.user);

  const { _id } = loggedInUser || {};
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [chatPerson, setChatPerson] = useState(null);
  const connections = useSelector((store) => store?.connections);

  const fetchChatMessages = async () => {
    try {
      setLoading(true);
      const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });
      const messagess = chat?.data?.messages;
      const newMessages = messagess.map((msg) => {
        const { senderId, text, createdAt, updatedAt } = msg;
        return {
          senderId: senderId._id,
          firstName: senderId.firstName,
          lastName: senderId.lastName,
          photo: senderId?.photo,
          text,
          createdAt,
          updatedAt,
        };
      });

      setMessages((messages) => [...messages, ...newMessages]);
    } catch (err) {
      console.log(err.message);
      if (err.response?.status === 401) {
        dispatch(removeUser());
        navigate("/app/login");
      } else if (err.response?.status === 403) {
        navigate("/app/premium");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res?.data?.data));
    } catch (err) {
      console.error(err);
      if (err.status === 401) {
        navigate("/app/login");
        dispatch(removeUser());
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!connections) {
      fetchChatMessages();
    } else {
      setChatPerson(
        connections.filter((connection) => connection?._id === targetUserId)[0]
      );
    }
  }, [connections]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchChatMessages();
  }, []);

  useEffect(() => {
    if (!_id) return;
    const socket = createSocketConnection();

    socket.emit("joinChat", { _id, targetUserId });

    socket.on(
      "messageReceived",
      ({ senderId, firstName, lastName, text, createdAt }) => {
        setMessages((messages) => [
          ...messages,
          { senderId, firstName, lastName, text, createdAt },
        ]);
      }
    );

    return () => {
      socket.disconnect();
    };
  }, [_id, targetUserId]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
      });
    }
  }, [messages]);

  const handleSendChatMessage = () => {
    if (chatMessage.trim()) {
      const socket = createSocketConnection();

      socket.emit("sendMessage", {
        firstName: loggedInUser?.firstName,
        lastName: loggedInUser?.lastName,
        photo: loggedInUser?.photo,
        _id,
        targetUserId,
        text: chatMessage,
        createdAt: new Date().toISOString(),
      });
      setChatMessage("");
    }
  };
  const formatTime = (utcDate) => {
    const date = new Date(utcDate);
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      // weekday: "short",
      day: "2-digit",
      month: "short",
      // year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100 py-8">
      {messages ? (
        <div className="h-[80vh] bg-base-300 flex flex-col my-8 mx-auto  border-2 overflow-hidden rounded-lg w-11/12 md:w-1/2 border-none">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-rose-700 via-rose-500 to-rose-300 text-white px-6 py-4 flex items-center shadow-md ">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full mr-4 border-2 border-rose-400">
                <img src={chatPerson?.photo} alt="Profile-photo" />
              </div>
            </div>

            <h1 className="text-lg font-semibold">
              {chatPerson?.firstName + " " + chatPerson?.lastName}
            </h1>
          </div>

          {/* Chat Messages */}
          <div
            className="flex-grow overflow-y-auto px-4 py-6 bg-base-300"
            ref={containerRef}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat  ${
                  message.senderId === _id ? "chat-end " : " chat-start"
                } my-4`}
              >
                {/* Avatar */}
                <div className="chat-image avatar">
                  <div className="w-8 rounded-full border-2 border-cyan-50">
                    <img
                      alt="Chat avatar"
                      src={
                        message.senderId === _id
                          ? loggedInUser.photo
                          : chatPerson?.photo
                      }
                    />
                  </div>
                </div>

                {message.senderId !== _id ? (
                  <div className="chat-header">
                    {`${message.firstName} ${message.lastName}`}
                    <time className="text-xs opacity-50">
                      {" "}
                      {formatTime(message.createdAt)}{" "}
                    </time>
                  </div>
                ) : (
                  <div className="chat-header">
                    <time className="text-xs opacity-50">
                      {" "}
                      {formatTime(message.createdAt)}{" "}
                    </time>
                  </div>
                )}

                {/* Chat Bubble */}
                <div
                  className={`chat-bubble px-4 py-2 rounded-lg shadow-md ${
                    message.senderId === _id
                      ? "bg-yellow-500 text-black"
                      : "bg-blue-100 text-blue-900"
                  }`}
                >
                  {message.text}
                </div>

                {/* <div className="chat-footer opacity-50">Delivered</div> */}
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="bg-gradient-to-r from-rose-700 via-rose-500 to-rose-300 px-4 py-4 flex items-center">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && chatMessage.trim()) {
                  handleSendChatMessage();
                }
              }}
              placeholder="Type a message..."
              className="w-full px-4 py-3 rounded-md bg-cyan-50 text-blue-900 placeholder-blue-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 mr-4"
            />
            <button
              onClick={handleSendChatMessage}
              className="btn btn-success text-yellow-500 px-6 py-3 rounded-lg bg-base-300 hover:bg-yellow-500 hover:text-black hover:border-black hover:cursor-pointer transition-all"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <div className="h-[80vh] bg-cyan-50 flex flex-col my-8 mx-auto border-2 overflow-hidden rounded-lg w-11/12 md:w-1/2">
          {/* Chat Header Shimmer */}
          <div className="bg-blue-600 text-white px-6 py-4 flex items-center shadow-md animate-pulse">
            <div className="chat-image avatar">
              <div className="w-10 h-10 rounded-full mr-4 bg-gray-300"></div>
            </div>
            <div className="w-32 h-4 bg-gray-300 rounded-md"></div>
          </div>

          {/* Chat Messages Shimmer */}
          <div className="flex-grow overflow-y-auto px-4 py-6 bg-cyan-50">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className={`chat my-4 ${
                  index % 2 === 0 ? "chat-start" : "chat-end"
                } animate-pulse`}
              ></div>
            ))}
          </div>

          {/* Message Input Shimmer */}
          <div className="bg-blue-600 px-4 py-4 flex items-center animate-pulse">
            <div className="w-full h-10 bg-gray-300 rounded-md mr-4"></div>
            <div className="w-20 h-10 bg-gray-400 rounded-lg"></div>
          </div>
        </div>
      )}
      ;
    </div>
  );
};

export default Chat;
