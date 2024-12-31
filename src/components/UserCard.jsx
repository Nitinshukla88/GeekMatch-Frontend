import React from "react";

const UserCard = ({ user }) => {
  const { firstName, lastName, about, age, gender, photo } = user;

  return (
    <div className="flex justify-center my-16">
      <div className="card bg-base-300 w-96 shadow-xl">
        <figure>
          <img
            src={photo}
            alt="Shoes"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{firstName + " " + lastName}</h2>
          {age && gender && <h3>{age + ", " + gender}</h3>}
          <p>{about}</p>
          <div className="card-actions justify-center">
            <button className="btn btn-primary mx-2">Ignore</button>
            <button className="btn btn-secondary">Interested</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
