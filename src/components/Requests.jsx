import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  addRequests,
  removeAllRequests,
  removeRequest,
} from "../utils/appStoreSlices/requestsSlice";
import { useNavigate } from "react-router-dom";
import { removeUser } from "../utils/appStoreSlices/userSlice";
import Loader from "./Loader";
import { IoPersonRemoveOutline } from "react-icons/io5";
import { removeFeed } from "../utils/appStoreSlices/feedSlice";
import { removeConnections } from "../utils/appStoreSlices/connectionSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const friendRequests = useSelector((store) => store?.requests);
  const [loading, setLoading] = useState(false);

  const getRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res?.data?.matchedRequests));
    } catch (err) {
      console.error(err);
      if (err.status === 401) {
        navigate("/app/login");
        dispatch(removeUser());
        dispatch(removeFeed());
        dispatch(removeAllRequests());
        dispatch(removeConnections());
      } else {
        navigate("/app/error", {
          state: {
            message: err.message || "Something went wrong",
            note: "Error fetching user received requests",
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const reviewRequest = async (status, _id) => {
    try {
      setLoading(true);
      const res = axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      console.log(res);
      dispatch(removeRequest(_id));
    } catch (err) {
      console.error(err);
      if (err.status === 401) {
        navigate("/app/login");
        dispatch(removeUser());
        dispatch(removeFeed());
        dispatch(removeConnections());
        dispatch(removeAllRequests());
      } else {
        navigate("/app/error", {
          state: {
            message: err.message || "Something went wrong",
            note: `Error ${
              status === "accepted" ? "accepting" : "rejecting"
            } the request`,
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!friendRequests) getRequests();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (friendRequests?.length === 0)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100 p-4">
        <div className="bg-base-300 shadow-lg rounded-lg p-6 max-w-md text-center">
          <IoPersonRemoveOutline className="text-4xl text-red-700 mx-auto mb-3" />
          <h1 className="text-xl font-semibold bg-gradient-to-r from-rose-700 via-rose-500 to-rose-300 bg-clip-text text-transparent">
            No Connection Requests
          </h1>
          <p className="text-yellow-500 mt-2">
            You have no connection requests currently. Check back later for new
            requests!
          </p>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col items-center py-10 min-h-screen px-4 bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100">
      <h1 className="font-bold bg-gradient-to-r from-rose-700 via-rose-500 to-rose-300 bg-clip-text text-transparent text-5xl mb-6 text-center">
        Connection Requests
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {friendRequests?.map((request) => {
          const { _id, firstName, lastName, age, gender, about, photo } =
            request?.fromUserId;
          return (
            <div
              className="shadow-md rounded-lg p-4 flex flex-col items-center text-center bg-white text-black"
              key={_id}
            >
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-300">
                <img
                  src={photo}
                  alt="user-photo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className=" mt-4">
                <h2 className="font-bold text-lg">
                  {`${firstName} ${lastName}`}
                </h2>
                {age && gender && (
                  <p className="text-sm text-gray-500">{`${age}, ${gender}`}</p>
                )}
                <p className="text-sm text-gray-700 mt-2">{about}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  className="btn btn-sm btn-primary text-white"
                  onClick={() => reviewRequest("accepted", request?._id)}
                >
                  Accept
                </button>
                <button
                  className="btn btn-sm btn-error text-gray-100"
                  onClick={() => reviewRequest("rejected", request._id)}
                >
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;
