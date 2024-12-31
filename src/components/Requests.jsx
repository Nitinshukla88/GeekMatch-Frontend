import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequests } from "../utils/appStoreSlices/requestsSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const friendRequests = useSelector((store) => store?.requests);

  const getRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res?.data?.matchedRequests));
    } catch (err) {
      console.error(err);
    }
  };

  const reviewRequest = async(status, _id) => {
    try{
        const res = axios.post(BASE_URL + "/request/review/" + status + "/" + _id, {}, {withCredentials: true});
        console.log(res);
        dispatch(removeRequests(_id))
    }catch(err){    
        console.error(err);
    }
  }

  useEffect(() => {
    getRequests();
  }, []);

  if (!friendRequests) return;

  if (friendRequests.length === 0) return <h2 className="my-10 text-white text-center font-medium text-4xl">No friend Requests !!</h2>;

  return (
    <div className="text-center mx-auto">
      <h1 className="my-10 text-purple-600 font-medium text-4xl">
        Friend Requests
      </h1>
      {friendRequests.map((request) => {
        const { _id, firstName, lastName, age, gender, about, skills, photo } =
          request?.fromUserId;
        return (
          <div className="bg-base-300 mx-auto my-4 flex w-[45%] items-center justify-between" key={_id}>
            <div className="mx-4 my-4">
              <img
                src={photo}
                alt="user-photo"
                className="w-20 h-20 rounded-2xl"
              />
            </div>
            <div className="text-left my-4">
              <h2 className="text-xl font-semibold">
                {firstName + " " + lastName}
              </h2>
              <h2>{age + ", " + gender}</h2>
              <h2>{about}</h2>
            </div>
            <div>
              <button className="btn btn-primary mx-2" onClick={()=> reviewRequest("rejected", request?._id)}>Reject</button>
              <button className="btn btn-secondary mx-2" onClick={() => reviewRequest("accepted", request?._id)}>Accept</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
