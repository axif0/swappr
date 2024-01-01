import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";
import Swal from 'sweetalert2';

const Cards = ({ item }) => {
  const { 
    user, semester, dealerCourse, dealerSection, 
    interestedCourse, interestedSections, isAvailable, reward
  } = item;

  const {user: currentUser} = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isHeartFilled, setIsHeartFilled] = useState(false);

  const handleHeartClick = () => {
    setIsHeartFilled(!isHeartFilled);
  };

  const handleAddToCart = () => {
    // Assuming some functionality for Add to Cart, update as needed
    if (currentUser) {
      // Perform Add to Cart operations
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Item added to the cart.',
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      Swal.fire({
        title: 'Please login to continue',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Login now!'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login', {state: {from: location}});
        }
      });
    }
  }

  return (
    <div className="card shadow-xl relative mr-5 md:my-5">
      <div
        className={`absolute right-2 top-2 p-4 ${
          isHeartFilled ? "text-rose-500" : "text-white"
        }`}
        onClick={handleHeartClick}
      >
        {/* Heart icon or any other icon */}
      </div>
      <div className="card-body">
        <h2 className="card-title">User ID: {user}</h2>
        <p>Why Swap: {semester}</p>
        <p>Dealer Course: {dealerCourse}</p>
        <p>Dealer Section: {dealerSection}</p>
        <p>Interested Course: {interestedCourse.join(", ")}</p>
        <p>Interested Sections: {interestedSections.join(", ")}</p>
        <p>Is Available: {isAvailable ? "Yes" : "No"}</p>
        <p>Reward: {reward}</p>

        <div className="card-actions justify-between items-center mt-2">
          <button onClick={handleAddToCart} className="btn bg-green text-white">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default Cards;
