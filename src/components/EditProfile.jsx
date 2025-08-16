import React, { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/appStoreSlices/userSlice";

const EditProfile = ({ userInfo }) => {
  const [firstName, setFirstName] = useState(userInfo?.firstName);
  const [lastName, setLastName] = useState(userInfo?.lastName);
  const [gender, setGender] = useState(userInfo?.gender || "");
  const [age, setAge] = useState(userInfo?.age || "");
  const [about, setAbout] = useState(userInfo?.about || "");
  const [photo, setPhoto] = useState(userInfo?.photo || "https://geographyandyou.com/images/user-profile.png");
  const [error, setError] = useState("");
  const [isProfileChanged, setIsProfileChanged] = useState(false);

  const dispatch = useDispatch();

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
    // setIsProfileChanged(true);
    // setError("");
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
        setError("Please select a valid gender.It must be male, female or others.");
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
        setError("Please enter a valid photo URL. It must end with .jpg, .jpeg, .gif, .webp or .png");
        return;
      }
      setError("");
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
      setError(err?.response?.data);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="flex justify-center items-center mx-12">
        <div className="card bg-primary text-primary-content w-[35rem]">
          <div className="card-body">
            <h2 className="card-title justify-center text-3xl">Edit Profile</h2>
            <div className="flex">
              <div className="mx-4">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text text-black font-semibold">
                      First Name:
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="Type here"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="input input-bordered w-full max-w-xs text-white"
                  />
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text text-black font-semibold">
                      Last Name:
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="Type here"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="input input-bordered w-full max-w-xs text-white"
                  />
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text text-black font-semibold">
                      Gender:
                    </span>
                  </div>
                  <select
                    className="text-white bg-base-100 rounded-lg py-3 px-3"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                  </select>
                </label>
              </div>
              <div className="mx-4">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text text-black font-semibold">
                      Age:
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="Type here"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="input input-bordered w-full max-w-xs text-white"
                  />
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text text-black font-semibold">
                      About:
                    </span>
                  </div>
                  <textarea
                    className="textarea text-white text-base h-24"
                    placeholder="Type here"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                  ></textarea>
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text text-black font-semibold">
                      Photo URL:
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="Type here"
                    value={photo}
                    onChange={(e) => setPhoto(e.target.value)}
                    className="input input-bordered w-full max-w-xs text-white"
                  />
                </label>
              </div>
            </div>
            <p className="text-red-600 font-semibold">{error}</p>
            <div className="card-actions justify-center mt-3">
              <button className="btn btn-secondary" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      <UserCard user={{ firstName, lastName, gender, age, photo, about }} />
      {isProfileChanged && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile changed Successfully</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
