import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import {
  addConnections,
  removeConnections,
} from "../utils/appStoreSlices/connectionSlice";
import { removeUser } from "../utils/appStoreSlices/userSlice";
import Loader from "./Loader";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { removeFeed } from "../utils/appStoreSlices/feedSlice";
import { removeAllRequests } from "../utils/appStoreSlices/requestsSlice";

const VideoChat = () => {
  const { targetUserId } = useParams();
  const loggedInUser = useSelector((store) => store?.user);
  const [videoCalleeName, setVideoCalleeName] = useState(null);
  const [loading, setLoading] = useState(false);
  const { _id, firstName } = loggedInUser || {};
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [show, setShow] = useState({ firstScreen: false, SecondScreen: false });
  const navigate = useNavigate();
  const [isConnectCallClicked, setIsConnectCallClicked] = useState(true);
  const connections = useSelector((store) => store?.connections);
  const dispatch = useDispatch();

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
        dispatch(removeFeed());
        dispatch(removeConnections());
        dispatch(removeAllRequests());
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!connections) {
      fetchConnections();
    } else {
      setVideoCalleeName(
        connections.filter((connection) => connection?._id === targetUserId)[0]
      );
    }
  }, [connections]);

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
        setShow((state) => ({ ...state, SecondScreen: true }));
        await setRemoteAnswer(answer);
      }
    );

    socket.on("partner-disconnected", async ({ message, roomId }) => {
      setShow((state) => ({ ...state, SecondScreen: false }));
    });

    return () => {
      socket.disconnect();
      peer.removeEventListener("negotiationneeded", handleNegotiation);
    };
  }, [_id, targetUserId, firstName]);

  useEffect(() => {
    getUserMedia();
  }, [getUserMedia]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100">
      <div className="flex gap-16">
        <div className="w-[400px] h-[300px] rounded-lg overflow-hidden">
          {show?.firstScreen ? (
            <>
              <p className="mx-2 text-lg text-gray-600 font-semibold">
                {firstName}
              </p>
              <ReactPlayer
                url={myStream}
                playing
                muted
                width="100%"
                height="100%"
              />
            </>
          ) : (
            <>
              <p className="mx-2 text-lg text-gray-600 font-semibold">
                {firstName}
              </p>
              <div className="w-full h-full bg-slate-600 flex items-center justify-center text-white">
                <span>Loading...</span>
              </div>
            </>
          )}
        </div>

        <div className="w-[400px] h-[300px] rounded-lg overflow-hidden">
          {show?.SecondScreen ? (
            <>
              <p className="mx-2 text-lg text-gray-600 font-semibold">
                {videoCalleeName?.firstName}
              </p>
              <ReactPlayer
                url={remoteStream}
                playing
                muted
                width="100%"
                height="100%"
              />
            </>
          ) : (
            <>
              <p className="mx-2 text-lg text-gray-600 font-semibold">
                {videoCalleeName?.firstName}
              </p>
              <div className="w-full h-full bg-slate-600 flex items-center justify-center text-white">
                <span>Loading...</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-9">
        {isConnectCallClicked && (
          <button
            className="btn btn-primary bg-green-500 text-white"
            onClick={(e) => {
              setShow((state) => ({ ...state, firstScreen: true }));
              sendStream(myStream);
              setIsConnectCallClicked(false);
            }}
          >
            Connect call
          </button>
        )}
        <button
          className="btn btn-secondary bg-rose-500 text-white"
          onClick={(e) => navigate("/app/connections")}
        >
          Disconnect call
        </button>
      </div>
    </div>
  );
};

export default VideoChat;
