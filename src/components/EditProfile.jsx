import { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser, removeUser } from "../utils/appStoreSlices/userSlice";
import { useNavigate } from "react-router-dom";
import { removeFeed } from "../utils/appStoreSlices/feedSlice";
import {removeConnections} from "../utils/appStoreSlices/connectionSlice"
import {removeAllRequests} from "../utils/appStoreSlices/requestsSlice"

const EditProfile = ({ userInfo }) => {
  const [firstName, setFirstName] = useState(userInfo?.firstName);
  const [lastName, setLastName] = useState(userInfo?.lastName);
  const [gender, setGender] = useState(userInfo?.gender || "");
  const [age, setAge] = useState(userInfo?.age || "");
  const [about, setAbout] = useState(userInfo?.about || "");
  const [photo, setPhoto] = useState(
    userInfo?.photo || "https://geographyandyou.com/images/user-profile.png"
  );
  const [error, setError] = useState("");
  const [isProfileChanged, setIsProfileChanged] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function isValidString(input) {
    if (
      !input ||
      input.length < 3 ||
      input.length > 50 ||
      !/^[a-zA-Z\s]+$/.test(input)
    ) {
      console.log("isValid", input);
      return false;
    }
    return true;
  }

  function isValidPhotoUrl(url) {
    // First check if it's a valid URL
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  function isValidAge(input) {
    if (
      input === "" ||
      input === null ||
      isNaN(input) ||
      input <= 17 ||
      input >= 105
    ) {
      return false;
    }
    return true;
  }

  function isValidGender(input) {
    if (!["male", "female", "others"].includes(input.toLowerCase())) {
      return false;
    }
    return true;
  }

  function isValidAbout(input) {
    if (about.length > 500) {
      return false;
    }
    return true;
  }

  const handleSave = async () => {
    try {
      if (!isValidString(firstName)) {
        setError(
          "Minimum 3 to maximum 50 alphabet only characters required in first name."
        );
        return;
      }
      if (!isValidString(lastName)) {
        setError(
          "Minimum 3 to maximum 50 alphabet only characters required in last name."
        );
        return;
      }
      if (!isValidGender(gender)) {
        setError(
          "Please select a valid gender.It must be male, female or others."
        );
        return;
      }
      if (!isValidAge(age)) {
        setError("Please enter a valid age between 18 and 120.");
        return;
      }
      if (!isValidAbout(about)) {
        setError("About section cannot exceed 500 characters.");
        return;
      }
      if (!isValidPhotoUrl(photo)) {
        setError(
          "Please enter a valid photo URL. It must end with .jpg, .jpeg, .gif, .webp or .png"
        );
        return;
      }
      setError("");
      setIsProfileChanged(true);
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, gender, age, about, photo },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      const timeout = setTimeout(() => {
        setIsProfileChanged(false);
      }, 3000);
    } catch (err) {
      console.log(err);
      if (err.status == 401) {
        navigate("/app/login");
        dispatch(removeUser());
        dispatch(removeFeed());
        dispatch(removeConnections());
        dispatch(removeAllRequests());
      } else {
        setError(err?.response?.data);
      }
    }
  };

  return (
    <>
      <div className="container mx-auto py-8 text-gray-700">
        <div className="flex flex-wrap justify-center gap-8">
          <UserCard user={{ firstName, lastName, gender, age, photo, about }} />
          <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-3xl font-bold text-center mb-6">
              Edit Profile
            </h2>
            <form className="space-y-4">
              <div className="form-control">
                <label className="label text-sm font-medium text-gray-500">
                  First Name:
                </label>
                <input
                  type="text"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input input-bordered w-full focus:outline-none focus:ring focus:ring-blue-300 bg-gray-200"
                />
              </div>
              <div className="form-control">
                <label className="label text-sm font-medium text-gray-500">
                  Last Name:
                </label>
                <input
                  type="text"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input input-bordered w-full focus:outline-none focus:ring focus:ring-blue-300 bg-gray-200"
                />
              </div>
              <div className="form-control">
                <label className="label text-sm font-medium text-gray-500">
                  Gender:
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={gender === "male"}
                      className="radio radio-info"
                      onChange={(e) => setGender(e.target.value)}
                    />
                    <span className="ml-2">Male</span>
                  </label>
                  <label className="flex items-center text-gray-500">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={gender === "female"}
                      className="radio radio-info"
                      onChange={(e) => setGender(e.target.value)}
                    />
                    <span className="ml-2">Female</span>
                  </label>
                  <label className="flex items-center text-gray-500">
                    <input
                      type="radio"
                      name="gender"
                      value="others"
                      checked={gender === "others"}
                      className="radio radio-info"
                      onChange={(e) => setGender(e.target.value)}
                    />
                    <span className="ml-2">Other</span>
                  </label>
                </div>
                <div className="form-control">
                  <label className="label text-sm font-medium text-gray-500">
                    Age:
                  </label>
                  <input
                    type="number"
                    className="input input-bordered  py w-full focus:outline-none focus:ring focus:ring-blue-300 bg-gray-200 appearance-none overflow-hidden"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Enter your age"
                  />
                </div>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text text-gray-500 font-semibold">
                      About:
                    </span>
                  </div>
                  <textarea
                    className="textarea text-base bg-gray-200 h-24"
                    placeholder="Type here"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                  ></textarea>
                </label>
                <div className="form-control">
                  <label className="label text-sm font-medium text-gray-500">
                    Photo URL:
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full focus:outline-none focus:ring focus:ring-blue-300 bg-gray-200"
                    value={photo}
                    onChange={(e) => setPhoto(e.target.value)}
                    placeholder="Enter the photo URL"
                  />
                </div>
              </div>
              {error && <p className="text-red-600 font-semibold">{error}</p>}
              <div className="flex flex-col items-center space-y-4">
                <button
                  className="btn btn-primary text-white w-full"
                  onClick={handleSave}
                  type="button"
                >
                  Save profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
        {isProfileChanged && (
          <div className="toast toast-top toast-center z-50">
            <div className="alert alert-success shadow-lg">
              <span>Profile changed Successfully</span>
            </div>
          </div>
        )}
    </>
  );
};

export default EditProfile;
