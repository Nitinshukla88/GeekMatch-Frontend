import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeFeed } from "../utils/appStoreSlices/feedSlice";
import UserCard from "./UserCard";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { removeUser } from "../utils/appStoreSlices/userSlice";
import { removeConnections } from "../utils/appStoreSlices/connectionSlice";
import { removeAllRequests } from "../utils/appStoreSlices/requestsSlice";

const Feed = () => {
  const feed = useSelector((store) => store?.feed);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const getFeed = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data.data));
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/app/login");
        dispatch(removeUser());
        dispatch(removeFeed());
        dispatch(removeConnections());
        dispatch(removeAllRequests());
        console.error(err.message);
      } else {
        navigate("/app/error", {
          state: {
            message: err.message || "Something went wrong",
            note: "Error fetching feed",
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getFeed();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-grow flex justify-center items-center py-8 bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100 min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!feed) return;

  if (feed.length <= 0)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100 p-4">
        <div className="bg-base-300 shadow-lg rounded-lg p-6 max-w-md text-center">
          <IoMdCheckmarkCircleOutline className="text-4xl text-rose-700 mx-auto mb-3" />
          <h1 className="text-xl font-semibold bg-gradient-to-r from-rose-700 via-rose-500 to-rose-300 bg-clip-text text-transparent">
            No More Profiles Available
          </h1>
          <p className="text-yellow-500 mt-2">
            You have interacted with all the profiles. Please check back later
            for new Profiles!
          </p>
        </div>
      </div>
    );

  return (
    <div className="flex-grow flex justify-center items-center py-8 bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100 min-h-screen">
      {isLoading ? (
        <Loader />
      ) : feed ? (
        <div>
          <UserCard user={feed[0]} />
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md text-center">
          <IoMdCheckmarkCircleOutline className="text-4xl text-rose-700 mx-auto mb-3" />
          <h1 className="text-xl font-semibold bg-gradient-to-r from-rose-700 via-rose-500 to-rose-300 bg-clip-text text-transparent">
            No More Profiles Available
          </h1>
          <p className="text-yellow-500 mt-2">
            You have interacted with all the profiles. Please check back later
            for new Profiles!
          </p>
        </div>
      )}
    </div>
  );
};

export default Feed;
