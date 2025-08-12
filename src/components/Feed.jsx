import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from 'react-redux';
import { addFeed } from '../utils/appStoreSlices/feedSlice';
import UserCard from './UserCard';
import { useNavigate } from 'react-router-dom';

const Feed = () => {

  const feed = useSelector((store) => store?.feed);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getFeed = async() => {
    if(feed) return; 
    try{
      const res = await axios.get(BASE_URL + "/user/feed", { withCredentials : true });
      dispatch(addFeed(res?.data.data));
    }catch(err){
      if(err.message === "Request failed with status code 401"){
        navigate("/app/login");
      }
      console.error(err.message);
    }
  }

  useEffect(()=> {
    getFeed();
  }, []);

  if(!feed) return;

  if(feed.length <= 0) return <h2 className='text-center text-3xl my-10 font-medium text-white'>No more Users are found !!</h2>

  return (
    feed && <div>
      <UserCard user={feed[0]}/>
    </div>
  )
}

export default Feed;