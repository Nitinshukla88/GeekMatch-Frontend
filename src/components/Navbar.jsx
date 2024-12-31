import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/appStoreSlices/userSlice";

const Navbar = () => {

  const user = useSelector((store) => store?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async() => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials : true });
      dispatch(removeUser());
      navigate("/login");
    } catch(err){
      console.error(err);
    }
  }

  return (
    <div className="navbar bg-base-300">
      <div className="flex-1">
        <Link to="/feed" className="btn btn-ghost text-xl">❤️GeekMatch</Link>
      </div>
      <div className="flex-none gap-2">
        {user && <p className="font-semibold"> Welcome, {user?.firstName}</p>}
        <div className="form-control"></div>
        {user && (
          <div className="dropdown dropdown-end mx-4">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
