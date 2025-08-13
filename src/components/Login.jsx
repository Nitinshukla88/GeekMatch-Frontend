import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/appStoreSlices/userSlice";
import { BASE_URL } from "../utils/constants";
import { Link, useNavigate } from "react-router-dom";
import validator from "validator";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store?.user);

  useEffect(()=> {
    window.scrollTo(0, 0);
    if(user != null) {
      navigate("/app/feed");
    }
  }, [user]);

  const validateLoginData = () => {
    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid Email: Please enter a valid email.");
    } else if (!validator.isStrongPassword(password)) {
      throw new Error(
        "Invalid password: Must contain 8+ characters with at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character."
      );
    }
  }

  const handleLogin = async () => {
    try {
      setError("");
      validateLoginData();
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate("/app/feed");
    } catch (err) {
      setError(err?.response?.data || "Login Failed");
      if (error.response) {
      } else if (error.request) {
        //axios error with no response (network issue)
        setError("Network error. Please check your connection.");
      } else if (error.message) {
        //regular Error object (including validation errors)
        setError(error.message);
      } else {
        //fallback for any other error
        setError("Signup failed. Please try again.");
      }
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
          <p className="text-center font-medium">New to GeekMatch❤️? <Link to="/app/sign-up"><span className="text-white hover:underline cursor-pointer">Sign Up Now.</span></Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
