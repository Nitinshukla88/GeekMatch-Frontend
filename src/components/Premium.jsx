import React from "react";

const Premium = () => {
  return (
    <div className="flex justify-center items-center my-16">
      <div className="card bg-base-300 w-96 shadow-2xl m-4 py-10">
        <div className="card-body items-center text-center">
          <h1 className="card-title text-3xl font-bold my-2">Silver Membership</h1>
          <ul className="my-3">
            <li className="list-disc text-left">Chat with other people</li>
            <li className="list-disc text-left">100 connection requesets per day!</li>
            <li className="list-disc text-left">Blue tick</li>
            <li className="list-disc text-left">3 months validity</li>
          </ul>
          <div className="card-actions">
            <button className="btn btn-primary">Buy Now</button>
          </div>
        </div>
      </div>
      <div className="card bg-base-300 w-96 shadow-2xl m-4 py-10">
        <div className="card-body items-center text-center">
          <h1 className="card-title text-3xl font-bold text-yellow-500 my-2">Gold Membership</h1>
          <ul className="my-3">
            <li className="list-disc text-left">Chat with other people</li>
            <li className="list-disc text-left">Video calling</li>
            <li className="list-disc text-left">Unlimited connection requesets per day!</li>
            <li className="list-disc text-left">Gold tick</li>
            <li className="list-disc text-left">6 months validity</li>
          </ul>
          <div className="card-actions">
            <button className="btn btn-secondary">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;
