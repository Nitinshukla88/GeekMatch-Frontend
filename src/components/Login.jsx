import axios from "axios";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    window.scrollTo(0, 0);
    if (user != null) {
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
  };

  const handleLogin = async () => {
    try {
      setError("");
      validateLoginData();
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data));
      navigate("/app/feed");
    } catch (error) {
      setError(error?.response?.data || "Login Failed");
      if (error.response) {
      } else if (error.request) {
        //axios error with no response (network issue)
        setError("Network error. Please check your connection.");
      } else if (error.message) {
        //regular Error object (including validation errors)
        setError(error.message);
      } else {
        //fallback for any other error
        setError("Login failed. Please try again.");
      }
    }
  };

  const validateSignUpData = () => {
    if (!firstName && !lastName && !emailId && !password) {
      throw new Error("Please enter details to proceed!");
    } else if (
      !validator.matches(firstName.trim(), /^[A-Za-z\s]+$/) ||
      firstName.trim().length < 3 ||
      firstName.trim().length > 50 ||
      !validator.matches(lastName.trim(), /^[A-Za-z\s]+$/) ||
      lastName.trim().length < 3 ||
      lastName.trim().length > 50
    ) {
      throw new Error(
        "Minimum 3 to maximum 50 alphabet only characters required in first name and Last name."
      );
    } else if (!validator.isEmail(emailId)) {
      throw new Error("Invalid Email: Please enter a valid email.");
    } else if (!validator.isStrongPassword(password)) {
      throw new Error(
        "Invalid password: Must contain 8+ characters with at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character."
      );
    }
  };

  const handleSignUp = async () => {
    try {
      setError("");
      validateSignUpData();
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      navigate("/app/profile");
    } catch (error) {
      if (error.response) {
        setError(error.response?.data || "Server error occurred");
      } else if (error.request) {
        setError("Network error. Please check your connection.");
      } else if (error.message) {
        setError(error.message);
      } else {
        setError("Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="items-center justify-evenly min-h-screen text-gray-700 bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100 flex flex-wrap ">
      <div className="intro-container m-6 py-8 md:w-[500px]">
        <div className="flex-1 pb-2 text-center md:text-left">
          <Link
            to="/app/feed"
            className=" text-7xl normal-case font-bold bg-gradient-to-r from-rose-700 via-rose-500 to-rose-300 bg-clip-text text-transparent "
          >
            GeekMatch
          </Link>
        </div>
        <h2 className="tag-line text-2xl font-medium text-gray-800 text-center md:text-left">
          Where code 👨🏼‍💻 meets chemistry 💞— connect with developers who speak
          your language.
        </h2>
      </div>

      <div className="card shadow-2xl w-[400px] rounded-xl p-8 m-6">
        <h1 className="text-3xl font-bold text-center mb-4 text-rose-600">
          {isLoginForm ? "Login to Your Account" : "Create an Account"}
        </h1>

        <form
          className="space-y-4 "
          onSubmit={(e) => {
            e.preventDefault();
            isLoginForm ? handleLogin() : handleSignUp();
          }}
        >
          {!isLoginForm && (
            <>
              <div className="form-control ">
                <label className="label">
                  <span className="label-text font-medium text-gray-800">
                    First Name
                  </span>
                </label>
                <input
                  type="text"
                  className="input input-bordered bg-white"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-gray-800">
                    Last Name
                  </span>
                </label>
                <input
                  type="text"
                  className="input bg-white input-bordered"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
            </>
          )}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-gray-800">
                Email Address
              </span>
            </label>
            <input
              type="email"
              className="input input-bordered bg-white"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-gray-800">
                Password
              </span>
            </label>
            <input
              type="password"
              className="input input-bordered bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <button
            type="submit"
            className="btn btn-primary text-white bg-rose-700 border-none w-full mt-4"
          >
            {isLoginForm ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          {isLoginForm ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="text-rose-600 hover:underline"
            onClick={() => {
              setError("");
              setEmailId("");
              setFirstName("");
              setLastName("");
              setPassword("");
              setIsLoginForm(!isLoginForm);
            }}
          >
            {isLoginForm ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
