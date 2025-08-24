import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/appStoreSlices/userSlice";
import { removeFeed } from "../utils/appStoreSlices/feedSlice";
import { removeConnections } from "../utils/appStoreSlices/connectionSlice";

const Navbar = () => {
  const user = useSelector((store) => store?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      dispatch(removeFeed());
      dispatch(removeConnections());
      navigate("/app/login");
    } catch (err) {
      console.error(err);
      navigate("/app/error", {
        state : {
          message : err?.message || "Something went wrong",
          note : "Error Logging Out",
        }
      })
    }
  };

  return (
    <>
      <div className="navbar bg-base-300 sticky top-0 z-50 shadow-lg">
        <div className="flex-1">
          <span className="text-3xl mx-1">💖</span>
          <Link
            to="/app/feed"
            className="btn btn-ghost text-3xl bg-gradient-to-r from-rose-700 via-rose-500 to-rose-300 bg-clip-text text-transparent my-1 px-0 font-semibold"
          >
            GeekMatch
          </Link>
        </div>
        <div className="flex gap-2 items-center">
          {user && (
            <p className="font-semibold text-sm hidden sm:block text-white">
              {" "}
              Welcome,{" "}
              <span className="text-yellow-500">{user?.firstName}</span>
            </p>
          )}
          <div className="form-control"></div>
          {user && (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar hover:bg-yellow-500"
              >
                <div className="w-10 rounded-full border-2 border-white">
                  <img
                    alt="User-Avatar"
                    src={user?.photo}
                    className="object-cover"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-300 text-yellow-500 rounded-box mt-3 w-52 p-2 shadow-lg"
              >
                <li>
                  <Link to="/app/feed" className="flex items-center gap-2">
                    <span className="material-symbols-outlined">
                      dynamic_feed
                    </span>{" "}
                    Explore Bonds
                  </Link>
                </li>
                <li>
                  <Link to="/app/profile" className="flex items-center gap-2">
                    <span className="material-symbols-outlined">person</span>{" "}
                    Profile
                  </Link>
                </li>

                <li>
                  <Link to="/app/connections" className="flex items-center gap-2">
                    {" "}
                    <span className="material-symbols-outlined">group</span>
                    Connections
                  </Link>
                </li>
                <li>
                  <Link to="/app/requests" className="flex items-center gap-2">
                    {" "}
                    <span className="material-symbols-outlined">
                      person_add
                    </span>
                    Requests
                  </Link>
                </li>
                <li>
                  <Link to="/app/premium" className="flex items-center gap-2">
                    <span className="material-symbols-outlined">
                      workspace_premium
                    </span>{" "}
                    Premium
                  </Link>
                </li>
                <li>
                  <a
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-500 hover:bg-red-100"
                  >
                    <span className="material-symbols-outlined">logout</span>
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
