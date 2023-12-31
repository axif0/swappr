import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";
import Swal from 'sweetalert2';
import 'animate.css';

const Cards = ({ item }) => {
  const { 
    user, semester, dealerCourse, dealerSection, 
    interestedCourse, interestedSections, isAvailable, reward,
    studentId,contact
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
      // Assuming some functionality for Add to Cart operations
      // Show a SweetAlert modal with user email and whySwap
      Swal.fire({
        title: '<span class="text-thewhite">Details</span>',
        html: `
          <p><strong class="text-thewhite">✉️ ${user} </strong></p>
          <br>
          <p><strong class="text-thewhite">💬 ${semester}</strong></p>
          <br>
          <p><strong class="text-thewhite">🎁 ${reward}</strong></p>
          <br>
          <p><strong class="text-thewhite">📞 ${contact}</strong></p>
        `,
        icon: 'info',
        background: '#180a38', // Dark background color
        showConfirmButton: false,
        showCloseButton: true,
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            custom-faster
          `
        },

        
      });
    } else {
      Swal.fire({
        title: 'Please login to continue',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Login now!',
      }).then((result) => {
        if (result.isConfirmed) {
          document.getElementById('my_modal_5').showModal();
        }
      });
    }
  };

  return (
    <div className="card bg-gray-800 shadow-xl relative mr-5 md:my-5" style={{ width: '250px', height: '350px' }}>
      <div
        className={`absolute right-2 top-2 p-4 ${
          isHeartFilled ? "text-rose-500" : "text-white"
        }`}
        onClick={handleHeartClick}
      >
        {/* Heart icon or any other icon */}
      </div>
      
      <div className="card-body">
        <h2 className="card-title text-purple-300">{studentId}</h2>
        <p></p>
        <p> <strong><span className="text-thewhite">Has → </span><span className="text-blue-200">{dealerCourse} ({dealerSection}) </span></strong></p>
        <p> <strong><span className="text-thewhite">Needs → </span><span className="text-yellow-100">{interestedCourse.map((course, index) => `${course} (${interestedSections[index]})`).join(", ")}</span></strong></p>
        <p> <strong className="text-thewhite">Availability → </strong> <span style={{ color: isAvailable ? "lightgreen" : "red", fontWeight: "bold" }}>{isAvailable ? "Yes" : "No"}</span></p>

        <div className="card-actions justify-between items-center mt-2">
          <button
            onClick={handleAddToCart}
            className="btn bg-mygreen text-white focus:outline-none mx-auto"
            style={{ border: 'none' }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cards;
