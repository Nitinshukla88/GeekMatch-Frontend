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
        createdAt = formatTime(createdAt);
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

  const sendChatMessage = () => {
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
