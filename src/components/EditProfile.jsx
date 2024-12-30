import React, { useState } from "react";
import UserCard from "./UserCard";

const EditProfile = ({ userInfo }) => {
  const [firstName, setFirstName] = useState(userInfo?.firstName);
  const [lastName, setLastName] = useState(userInfo?.lastName);
  const [gender, setGender] = useState(userInfo?.gender);
  const [age, setAge] = useState(userInfo?.age);
  const [about, setAbout] = useState(userInfo?.about);
  const [photo, setPhoto] = useState(userInfo?.photo || "");

  return (
    <div className="flex justify-center items-center">
    <div className="flex justify-center items-center mx-12">
      <div className="card bg-primary text-primary-content w-[35rem] my-16">
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
            <input
              type="text"
              placeholder="Type here"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="input input-bordered w-full max-w-xs text-white"
            />
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
            <input
              type="text"
              placeholder="Type here"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="input input-bordered w-full max-w-xs text-white"
            />
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
          <div className="card-actions justify-center mt-3">
            <button className="btn btn-secondary">Save</button>
          </div>
        </div>
      </div>
    </div>
    <UserCard user={ {firstName, lastName, gender, age, photo, about} }/>
    </div>
  );
};

export default EditProfile;
