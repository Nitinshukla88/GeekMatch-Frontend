import React from 'react'
import EditProfile from './EditProfile'
import { useSelector } from 'react-redux'

const Profile = () => {

  const user = useSelector((store)=> store?.user);

  return (
    <EditProfile userInfo={user}/>
  )
}

export default Profile