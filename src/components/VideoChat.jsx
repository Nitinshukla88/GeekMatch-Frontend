import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import {
  createAnswer,
  createOffer,
  peer,
  sendStream,
  setRemoteAnswer,
} from "../utils/videoChatUtils";
import ReactPlayer from "react-player";

const VideoChat = () => {
  const { targetUserId } = useParams();
  const loggedInUser = useSelector((store) => store?.user);
  const { _id, firstName } = loggedInUser || {};
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [show, setShow] = useState({ firstScreen: false, SecondScreen: false });
  const navigate = useNavigate();

  const getUserMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
    setMyStream(stream);
  };

  const handleTrackEvent = (ev) => {
    const streams = ev.streams;
    setRemoteStream(streams[0]);
  };

  useEffect(() => {
    peer.addEventListener("track", handleTrackEvent);
    return () => {
      peer.removeEventListener("track", handleTrackEvent);
    };
  }, [peer, handleTrackEvent]);

  useEffect(() => {
    if (!_id) return;

    const socket = createSocketConnection();

    const handleNegotiation = async () => {
      console.log("negotiation needed");
      const localOffer = await createOffer();
      socket.emit("call-user", {
        firstName,
        _id,
        targetUserId,
        offer: localOffer,
      });
    };

    peer.addEventListener("negotiationneeded", handleNegotiation);

    socket.emit("join-room", { firstName, _id, targetUserId });

    socket.on(
      "joined-room",
      async ({ firstName: newUser, _id: newUserId, targetUserId }) => {
        console.log(
          `User ${newUser} joined with userId ${newUserId}, user1 id is ${targetUserId}. Sending offer...`
        );
        const offer = await createOffer();
        socket.emit("call-user", {
          firstName,
          _id,
          targetUserId: newUserId,
          offer,
        });
      }
    );

    socket.on(
      "incoming-call",
      async ({ firstName: callerName, offer, _id, targetUserId }) => {
        console.log(`Incoming call from ${callerName} with id ${_id}`, offer);
        const answer = await createAnswer(offer);
        socket.emit("call-accepted", { firstName, _id, targetUserId, answer });
      }
    );

    socket.on(
      "call-accepted",
      async ({ firstName, _id, targetUserId, answer }) => {
        console.log(`call got accepted`, answer);
        await setRemoteAnswer(answer);
      }
    );

    socket.on("partner-disconnected", async ({ message, roomId }) => {
      setShow({ firstScreen: true, SecondScreen: false });
    });

    return () => {
      socket.disconnect();
      peer.removeEventListener("negotiationneeded", handleNegotiation);
    };
  }, [_id, targetUserId, firstName]);

  useEffect(() => {
    getUserMedia();
  }, [getUserMedia]);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100">
      <div className="flex">
        <div>
          {show?.firstScreen && <ReactPlayer url={myStream} playing muted />}
        </div>
        <div>
          {show?.SecondScreen && (
            <ReactPlayer url={remoteStream} playing muted />
          )}
        </div>
      </div>
      <div className="flex justify-center gap-3">
        <button
          className="btn btn-primary"
          onClick={(e) => {
            setShow({ firstScreen: true, SecondScreen: true });
            sendStream(myStream);
          }}
        >
          Connect call
        </button>
        <button
          className="btn btn-secondary"
          onClick={(e) => navigate("/app/connections")}
        >
          Disconnect call
        </button>
      </div>
    </div>
  );
};

export default VideoChat;
