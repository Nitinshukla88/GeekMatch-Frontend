import React, { useEffect, useState } from 'react'
import Navbar from "./Navbar";
import { Outlet, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../utils/appStoreSlices/userSlice';
import axios from 'axios';
import Loader from './Loader';

const Body = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store)=> store?.user);

  const fetchUser = async() => {
    try{
      setLoading(true);
      const res = await axios.get(BASE_URL + "/profile/view", { withCredentials : true });
      dispatch(addUser(res?.data));

    }catch(err){
      navigate("/app/login");
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=> {
    fetchUser();
  }, []);

  return (
    <div>
        <Navbar/>
        {loading ? <Loader/> : <Outlet className="min-h-screen bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100"/>}
        <Footer/>
    </div>
  )
}

export default Body