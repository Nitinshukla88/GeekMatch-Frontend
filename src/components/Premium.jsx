import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { updateIsPremium, updateMembershipType } from "../utils/appStoreSlices/userSlice";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

const Premium = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isUserPremium = useSelector((state) => state?.user?.isPremium);
  const membershipType = useSelector((state) => state?.user?.membershipType);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const verifyPremiumUser = async () => {
    try{
    setLoading(true);
    const res = await axios.get(BASE_URL + "/premium/verify", {
      withCredentials: true,
    });
    console.log(res);
    console.log(res?.data?.isPremium);
    console.log(res?.data?.membershipType);
    if (res.data.isPremium) {
      dispatch(updateIsPremium(res.data.isPremium));
      dispatch(updateMembershipType(res.data.membershipType));
    }
  } catch (error) {
    console.error("Error verifying premium user:", error);
    if(error.status == 401) {
      navigate("/app/login");
    }
    } finally {
      setLoading(false);
    }
  };

  const handleBuyPremium = async (membership) => {
    try {
      setLoading(true);
    const order = await axios.post(
      BASE_URL + "/payment/create",
      { membershipType: membership },
      { withCredentials: true }
    );

    const { amount, orderId, notes, keyId } = order.data;

    const options = {
      key: keyId,
      amount: amount,
      currency: "INR",
      name: "GeekMatch",
      description: "Dating and Hangout platform for developers",
      order_id: orderId,
      prefill: {
        name: notes.firstName + " " + notes.lastName,
        email: notes.emailId,
        contact: "9999999999",
      },
      theme: {
        color: "#F37254",
      },
      handler: verifyPremiumUser,
    };
    setLoading(false);

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch(error) {
    console.error("Error during payment process:", error);
    if(error.status === 401) {
      navigate("/app/login");
    }
  }
  };

  if(loading) {
    return <Loader />;
  }

  return isUserPremium ? (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-yellow-400 text-white flex flex-col items-center justify-center px-6 py-10">
      <h1 className="text-4xl font-bold mb-4 text-center">Welcome,{membershipType === "silver" ? " You're a Silver" : " You're a Gold"} User!</h1>
      <p className="text-lg text-center mb-6 max-w-3xl">
        {membershipType === "silver" ? "Thank you for subscribing to our Silver premium membership. You now have access" : "Thank you for subscribing to our Gold premium membership. You now have access"}
        to exclusive features like chatting {membershipType === "gold" && "and video calling "}eligibility, a verified {membershipType === "gold" ? "gold" : "silver"} tick,
        and more!
      </p>
      <div className="flex flex-col items-center w-full">
        <p className="text-2xl font-semibold mb-6 text-center">
          Explore Your Premium Benefits
        </p>
        <button
          onClick={() => navigate("/app/connections")}
          className="btn btn-primary text-lg px-8  rounded-lg shadow-md hover:bg-green-500 transition duration-300 bg-green-400 border-none"
        >
          Go to Connections
        </button>
      </div>
      {membershipType === "silver" && <div className="card bg-base-300 w-96 shadow-2xl m-4 py-12">
        <div className="card-body items-center text-center text-yellow-500">
          <h1 className="card-title text-3xl font-bold text-yellow-500 my-2">
            Gold Membership
          </h1>
          <ul className="my-3">
            <li className="list-disc text-left"> 💬 Chat with your connections</li>
            <li className="list-disc text-left"> 📹 Video calling with your connections</li>
            <li className="list-disc text-left">
              💌 Unlimited connection requests per day!
            </li>
            <li className="list-disc text-left">🥇 Gold tick</li>
            <li className="list-disc text-left">🕧 6 months validity</li>
            <li className="list-disc text-left">💰 ₹ 599/- per month only</li>
          </ul>
          <div className="card-actions">
            <button
              className="btn btn-secondary"
              onClick={() => handleBuyPremium("gold")}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>}
    </div>
  ) : (
    <div className="flex justify-center items-center flex-wrap gap-8 bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100 min-h-screen">
      <div className="card bg-base-300 w-96 shadow-2xl m-4 py-10">
        <div className="card-body items-center text-center text-slate-300">
          <h1 className="card-title text-3xl font-bold my-2">
            Silver Membership
          </h1>
          <ul className="my-3">
            <li className="list-disc text-left">💬 Chat with your connections</li>
            <li className="list-disc text-left">
              💌 50 connection requests per day only!
            </li>
            <li className="list-disc text-left">🥈 Blue tick</li>
            <li className="list-disc text-left">🕒 3 months validity</li>
            <li className="list-disc text-left">💰 ₹ 399/- per month only</li>
          </ul>
          <div className="card-actions">
            <button
              className="btn btn-primary"
              onClick={() => handleBuyPremium("silver")}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
      <div className="card bg-base-300 w-96 shadow-2xl m-4 py-12">
        <div className="card-body items-center text-center text-yellow-500">
          <h1 className="card-title text-3xl font-bold text-yellow-500 my-2">
            Gold Membership
          </h1>
          <ul className="my-3">
            <li className="list-disc text-left"> 💬 Chat with your connections</li>
            <li className="list-disc text-left"> 📹 Video calling with your connections</li>
            <li className="list-disc text-left">
              💌 Unlimited connection requests per day!
            </li>
            <li className="list-disc text-left">🥇 Gold tick</li>
            <li className="list-disc text-left">🕧 6 months validity</li>
            <li className="list-disc text-left">💰 ₹ 599/- per month only</li>
          </ul>
          <div className="card-actions">
            <button
              className="btn btn-secondary"
              onClick={() => handleBuyPremium("gold")}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;
