import { useEffect } from "react";
import EditProfile from "./EditProfile";
import { useSelector } from "react-redux";
import Loader from "./Loader";

const Profile = () => {
  const user = useSelector((store) => store?.user);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100">
      {user ? <EditProfile userInfo={user} /> : <Loader />}
    </div>
  );
};

export default Profile;
