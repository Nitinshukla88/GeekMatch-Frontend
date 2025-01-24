import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";

const Premium = () => {
  const [isUserPremium, setisUserPremium] = useState(false);
  useEffect(() => {
    verifyPremiumUser();
  }, []);
  const verifyPremiumUser = async () => {
    const res = await axios.get(BASE_URL + "/premium/verify", {
      withCredentials: true,
    });

    if (res.data.isPremium) {
      setisUserPremium(true);
    }
  };

  const handleBuyPremium = async (type) => {
    const order = await axios.post(
      BASE_URL + "/payment/create",
      { membershipType: type },
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

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return isUserPremium ? (
    <div className="text-center text-2xl font-semibold">You are already a Premium user!!</div>
  ) : (
    <div className="flex justify-center items-center my-16">
      <div className="card bg-base-300 w-96 shadow-2xl m-4 py-10">
        <div className="card-body items-center text-center">
          <h1 className="card-title text-3xl font-bold my-2">
            Silver Membership
          </h1>
          <ul className="my-3">
            <li className="list-disc text-left">Chat with other people</li>
            <li className="list-disc text-left">
              100 connection requesets per day!
            </li>
            <li className="list-disc text-left">Blue tick</li>
            <li className="list-disc text-left">3 months validity</li>
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
      <div className="card bg-base-300 w-96 shadow-2xl m-4 py-10">
        <div className="card-body items-center text-center">
          <h1 className="card-title text-3xl font-bold text-yellow-500 my-2">
            Gold Membership
          </h1>
          <ul className="my-3">
            <li className="list-disc text-left">Chat with other people</li>
            <li className="list-disc text-left">Video calling</li>
            <li className="list-disc text-left">
              Unlimited connection requesets per day!
            </li>
            <li className="list-disc text-left">Gold tick</li>
            <li className="list-disc text-left">6 months validity</li>
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
