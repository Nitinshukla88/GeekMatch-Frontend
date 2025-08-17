import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addConnections } from '../utils/appStoreSlices/connectionSlice'
import { Link, useNavigate } from 'react-router-dom'

const Connections = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const connections = useSelector(store => store?.connections);
    const isPremium = useSelector((store) => store?.user?.isPremium);
    const fetchConnections = async() => {
        setLoading(true);
        try{
            const res = await axios.get(BASE_URL + "/user/connections", { withCredentials : true });
            dispatch(addConnections(res?.data?.data));
        }catch(err){
            console.error(err);
            if(err.status === 401) {
                navigate("/app/login");
            }
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=> {
        fetchConnections();
    }, []);


    if(!connections) return;

    if(connections.length === 0) return <h1>No Connections !!</h1>

  return (
    <div className='text-center mx-auto'>
        <h1 className='my-10 text-purple-600 font-medium text-4xl'>Connections</h1>
        {connections.map((connection, index) => {
            const { _id, firstName, lastName, age, gender, about, skills, photo } = connection;
            return (
                <div className='bg-base-300 mx-auto my-4 flex w-1/2 items-center justify-between' key={index}>
                    <div className='flex'>
                    <div className='mx-4 my-4'>
                        <img src={photo} alt='user-photo' className='w-20 h-20 rounded-2xl'/>
                    </div>
                    <div className='text-left my-4'>
                        <h2 className='text-xl font-semibold'>{firstName + " " + lastName}</h2>
                        <h2>{age + ", " + gender}</h2>
                        <h2>{about}</h2>
                    </div>
                    </div>
                    <Link to={"/app/videoChat/"+_id}><button className='btn btn-secondary'>Video Chat</button></Link>
                    <Link to={"/app/chat/"+ _id}><button className='btn btn-primary mr-5'>Chat</button></Link>
                </div>
            )
        })}
    </div>
  )
}

export default Connections