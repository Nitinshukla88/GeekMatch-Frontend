import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/appStoreSlices/userSlice';

const Signup = () => {
      const [firstName, setFirstName] = useState("");
      const [lastName, setLastName] = useState("");
      const [emailId, setEmailId] = useState("");
      const [password, setPassword] = useState("");
      const [error, setError] = useState(null);
      const dispatch = useDispatch();
      const navigate = useNavigate();

    const handleSignUp = async() => {
        try{
            const res = await axios.post(BASE_URL + "/signup", { firstName, lastName, emailId, password }, {withCredentials : true});
            dispatch(addUser(res?.data?.data));
            navigate("/profile");
        }catch(err){
            setError(err?.response?.data);
        }
    }

  return (
    <div className="flex justify-center items-center">
      <div className="card bg-primary text-primary-content w-96">
        <div className="card-body">
          <h2 className="card-title justify-center text-3xl">Sign Up</h2>
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
            <button className="btn btn-secondary" onClick={handleSignUp}>
              Sign Up
            </button>
          </div>
          <p className="text-center font-medium">Already a User:)? <Link to="/login"><span className="text-white hover:underline cursor-pointer">Login Now.</span></Link></p>
        </div>
      </div>
    </div>
  )
}

export default Signup