import React, { useEffect } from 'react'
import Navbar from "./Navbar";
import { Outlet, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../utils/appStoreSlices/userSlice';
import axios from 'axios';

const Body = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store)=> store?.user);

  const fetchUser = async() => {
    if(user) return ;
    try{
      const res = await axios.get(BASE_URL + "/profile/view", { withCredentials : true });
      dispatch(addUser(res?.data));

    }catch(err){
      navigate("/login");
    }
  }

  useEffect(()=> {
    fetchUser();
  }, []);

  return (
    <div>
        <Navbar/>
        <Outlet/>
        <Footer/>
    </div>
  )
}

export default Body