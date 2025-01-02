import axios from "axios";
import React from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/appStoreSlices/feedSlice";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, about, age, gender, photo } = user;

  const dispatch = useDispatch();

  const handleSendRequest = async(status, userId) => {
    try{
      const res = await axios.post(BASE_URL + "/request/send/" + status + "/" + userId, {}, {withCredentials : true});
      console.log(res);
      dispatch(removeUserFromFeed(_id));
    }catch(err){
      console.error(err);
    }
  }

  return (
    <div className="flex justify-center my-16">
      <div className="card bg-base-300 w-96 shadow-xl">
        <figure>
          <img
            src={photo}
            alt="user-photo"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{firstName + " " + lastName}</h2>
          {age && gender && <h3>{age + ", " + gender}</h3>}
          <p>{about}</p>
          <div className="card-actions justify-center">
            <button className="btn btn-primary mx-2" onClick={()=> handleSendRequest("ignored", _id)}>Ignore</button>
            <button className="btn btn-secondary" onClick={()=> handleSendRequest("interested", _id)}>Interested</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
