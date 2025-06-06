import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/appStoreSlices/userSlice";
import { BASE_URL } from "../utils/constants";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate("/feed");
    } catch (err) {
      setError(err?.response?.data);
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="card bg-primary text-primary-content w-96 mt-24">
        <div className="card-body">
          <h2 className="card-title justify-center text-3xl">Login</h2>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text text-black font-semibold">
                Email ID:
              </span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              className="input input-bordered w-full max-w-xs text-white"
            />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text text-black font-semibold">
                Password:
              </span>
            </div>
            <input
              type="password"
              placeholder="Type here"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full max-w-xs text-white"
            />
          </label>
          <p className="text-red-700 font-semibold">{error}</p>
          <div className="card-actions justify-center mt-3">
            <button className="btn btn-secondary" onClick={handleLogin}>
              Login
            </button>
          </div>
          <p className="text-center font-medium">New to GeekMatch❤️? <Link to="/sign-up"><span className="text-white hover:underline cursor-pointer">Sign Up Now.</span></Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
