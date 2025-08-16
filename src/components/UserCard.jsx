import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/appStoreSlices/feedSlice";
import Loader from "./Loader";

const UserCard = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const { _id, firstName, lastName, about, age, gender, photo } = user;

  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      setLoading(true);
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      console.log(res);
      dispatch(removeUserFromFeed(_id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if(loading) {
    return <Loader/>
  }

  return (
    <div className="flex flex-col justify-center my-8 mx-8 max-[320px]:mx-4 w-96 max-[470px]:w-72 max-[320px]:w-full">
      <div className="card glass w-full bg-gradient-to-r from-rose-500 to-blue-400 text-white shadow-blue-900 shadow-2xl">
        <figure className="w-full h-96 flex items-center justify-center bg-gray-300 mx-auto">
          <img src={photo || "https://geographyandyou.com/images/user-profile.png"} alt="photo"  className="w-full h-full object-cover"/>
        </figure>
        <div className="card-body">
          <h2 className="card-title">{firstName + " " + lastName}</h2>
          {age && gender && <p>{age + ", " + gender}</p>}
          <p className="text-gray-100">{about}</p>
          <div className="card-actions justify-center mt-4">
            <button
              className="btn btn-primary text-yellow-500 bg-base-300 border-none hover:text-base-300"
              onClick={() => handleSendRequest("ignored", _id)}
            >
              Ignore
            </button>
            <button
              className="btn btn-accent text-rose-500 bg-base-300 border-none hover:text-base-300"
              onClick={() => handleSendRequest("interested", _id)}
            >
              Interested
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
