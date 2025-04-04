import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { createSocketConnection } from '../utils/socket';
import { createAnswer, createOffer, peer, sendStream, setRemoteAnswer } from '../utils/videoChatUtils';
import ReactPlayer from 'react-player';

const VideoChat = () => {
  const { targetUserId } = useParams();
  const loggedInUser = useSelector((store) => store?.user);
  const { _id, firstName } = loggedInUser || {};
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const[show, setShow] = useState(false);

  const getUserMedia = async()=>{
    const stream = await navigator.mediaDevices.getUserMedia({audio : false, video : true});
    setMyStream(stream);
  }

  const handleTrackEvent = (ev)=>{
    const streams = ev.streams;
    setRemoteStream(streams[0]);
  }

  

  useEffect(()=>{
    peer.addEventListener("track", handleTrackEvent);
    return (()=>{
      peer.removeEventListener("track", handleTrackEvent);})
},[peer, handleTrackEvent])

  useEffect(() => {
    
    if (!_id) return;

    const socket = createSocketConnection();

    const handleNegotiation = async()=>{
      console.log("negotiation needed");
      const localOffer = await createOffer();
      socket.emit("call-user", {firstName, _id, targetUserId, offer : localOffer});
    }

    peer.addEventListener("negotiationneeded", handleNegotiation);

    socket.emit("join-room", { firstName, _id, targetUserId });

    socket.on("joined-room", async ({ firstName: newUser, _id: newUserId, targetUserId }) => {
        console.log(`User ${newUser} joined with userId ${newUserId}, user1 id is ${targetUserId}. Sending offer...`);
        const offer = await createOffer();
        socket.emit("call-user", { firstName, _id, targetUserId: newUserId, offer });
    });

    socket.on("incoming-call", async({ firstName: callerName, offer, _id, targetUserId }) => {
      console.log(`Incoming call from ${callerName} with id ${_id}`, offer);
      const answer = await createAnswer(offer);
      socket.emit("call-accepted", {firstName, _id, targetUserId, answer});
    });

    socket.on("call-accepted", async({firstName, _id, targetUserId, answer})=>{
      console.log(`call got accepted`, answer);
      await setRemoteAnswer(answer);
    })

    return () => {
      socket.disconnect();
      peer.removeEventListener("negotiationneeded", handleNegotiation);
    };
  }, [_id, targetUserId, firstName]);

  useEffect(()=>{
    getUserMedia();
  },[getUserMedia])

  return <div className='flex'>
    <button className='btn btn-primary' onClick={(e)=> {
      console.log("Sending mySteam...");
      sendStream(myStream);
      setShow(true);
    }
      }>Connect call</button>
      <div className='flex'>
    {show && <>
    <ReactPlayer url={myStream} playing muted/>
    <ReactPlayer url={remoteStream} playing muted/></>}</div>
  </div>;
};

export default VideoChat;
