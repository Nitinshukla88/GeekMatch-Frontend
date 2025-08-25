import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  addConnections,
  removeConnection,
  removeConnections,
} from "../utils/appStoreSlices/connectionSlice";
import { Link, useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { IoPeopleOutline } from "react-icons/io5";
import {
  addVideoChatUser,
  removeUser,
} from "../utils/appStoreSlices/userSlice";
import { removeFeed } from "../utils/appStoreSlices/feedSlice";
import { removeAllRequests } from "../utils/appStoreSlices/requestsSlice";

const Connections = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const connections = useSelector((store) => store?.connections);
  const membershipType = useSelector((store) => store?.user?.membershipType);
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
      } else {
        navigate("/app/error", {
          state: {
            message: err.message || "Something went wrong",
            note: "Error fetching user connections",
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveConnection = async (connectionId) => {
    try {
      setLoading(true);
      const res = await axios.delete(
        BASE_URL + "/user/connections/remove/" + connectionId,
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) dispatch(removeConnection(connectionId));
    } catch (error) {
      console.error(error);
      if (error.status === 401) {
        navigate("/app/login");
        dispatch(removeUser());
        dispatch(removeFeed());
        dispatch(removeConnections());
        dispatch(removeAllRequests());
      } else {
        navigate("/app/error", {
          state: {
            message: error.message || "Something went wrong",
            note: "Error removing connection",
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!connections) fetchConnections();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!connections)
    return (
      <div className="min-h-screen bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100"></div>
    );

  if (connections.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100 p-4">
        <div className="bg-base-300 shadow-lg rounded-lg p-6 max-w-md text-center">
          <IoPeopleOutline className="text-4xl text-rose-700 mx-auto mb-3" />
          <h1 className="text-xl font-semibold bg-gradient-to-r from-rose-700 via-rose-500 to-rose-300 bg-clip-text text-transparent">
            No Connections Yet
          </h1>
          <p className="text-yellow-500 mt-2">
            Start connecting with people to build your network. Explore profiles
            and send connection requests!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100">
      <h1 className="font-bold bg-gradient-to-r from-rose-700 via-rose-500 to-rose-300 bg-clip-text text-transparent text-5xl my-10">
        Connections
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 w-full">
        {connections.map((connection, index) => {
          const { _id, firstName, lastName, age, gender, about, photo } =
            connection;
          return (
            <div
              className="card bg-base-300 text-white shadow-md hover:shadow-lg rounded-lg p-4 flex flex-col items-center justify-around"
              key={_id}
            >
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-300">
                <img
                  alt="User"
                  className="w-full h-full object-cover"
                  src={photo}
                />
              </div>
              <div className="text-center mt-4">
                <h2 className="font-bold text-lg bg-gradient-to-r from-rose-700 via-rose-500 to-rose-300 bg-clip-text text-transparent">{`${firstName} ${lastName}`}</h2>
                {age && gender && (
                  <p className="text-sm text-white">{`${age}, ${gender}`}</p>
                )}
                <p className="text-sm text-yellow-500 mt-2">{about}</p>
              </div>
              <div className="flex gap-2 mt-4 ">
                <Link
                  to={
                    membershipType === "silver" || membershipType === "gold"
                      ? `/app/chat/` + _id
                      : `/app/premium`
                  }
                >
                  <button className="btn btn-sm btn-success text-white">
                    {membershipType === "silver" || membershipType === "gold"
                      ? "Message"
                      : "Chat with Silver Premium"}
                  </button>
                </Link>

                <button
                  className="btn btn-sm btn-error text-gray-100"
                  onClick={() => handleRemoveConnection(_id)}
                >
                  Remove
                </button>
              </div>
              <Link
                to={
                  membershipType === "gold"
                    ? "/app/videoChat/" + _id
                    : "/app/premium"
                }
              >
                <button
                  className="btn btn-sm btn-secondary text-white my-3"
                  onClick={() =>
                    dispatch(
                      addVideoChatUser({
                        VideoCalleeName: firstName,
                      })
                    )
                  }
                >
                  {membershipType === "gold"
                    ? "Video Chat"
                    : "Video Chat with Gold Premium"}
                </button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
