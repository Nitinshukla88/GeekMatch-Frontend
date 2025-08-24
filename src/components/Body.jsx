import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../utils/appStoreSlices/userSlice";
import axios from "axios";
import Loader from "./Loader";
import { removeFeed } from "../utils/appStoreSlices/feedSlice";
import { removeConnections } from "../utils/appStoreSlices/connectionSlice";

const Body = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store) => store?.user);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res?.data));
    } catch (err) {
      if (err.status === 401) {
        navigate("/app/login");
        dispatch(removeUser());
        dispatch(removeFeed());
        dispatch(removeConnections());
      } else {
        navigate("/app/error", {
          state: {
            message:
              err?.message || "Something went wrong, please try again later.",
            note: "Error getting profile details.",
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user]);

  return (
    <div>
      <Navbar />
      {loading ? (
        <Loader />
      ) : (
        <Outlet className="min-h-screen bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100" />
      )}
      <Footer />
    </div>
  );
};

export default Body;
