import axios from 'axios'; // Import axios here
import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";
import Swal from 'sweetalert2';
import 'animate.css';
// import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAxiosSecure from '../hooks/useAxiosSecure';

const Cards = ({ item, addPinnedCourse }) => {
  const { _id, user, originalId,semester, dealerCourse, dealerSection, interestedCourse, interestedSections, isAvailable, reward, studentId, contact } = item;
  const axiosSecure = useAxiosSecure();


  const { user: currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isHeartFilled, setIsHeartFilled] = useState(false);

  const handleHeartClick = () => {
    setIsHeartFilled(!isHeartFilled);
  };

  const handlePinClick = () => {
    if (currentUser) {
      if (originalId) {
        addPinnedCourse(user, [originalId]);
      } else {
        console.error("Error: '_id' is undefined. Item:", item);
      }
    } else {
      // Show login alert
    }
  };

  const handleAddToCart = () => {
    // Assuming some functionality for Add to Cart, update as needed
    if (currentUser) {
    //  console.log(currentUser)
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
        // Include the View Sent button
        footer: '<button class="btn bg-mygreen text-white focus:outline-none" id="viewSentBtn">View Comments</button>',
        // Attach the event listener to the button
        didOpen: () => {
          const viewSentBtn = document.getElementById('viewSentBtn');
          if (viewSentBtn) {
            viewSentBtn.addEventListener('click', handleViewSent);
          }
        },
        willClose: () => {
          // Remove the event listener when the modal is closed
          const viewSentBtn = document.getElementById('viewSentBtn');
          if (viewSentBtn) {
            viewSentBtn.removeEventListener('click', handleViewSent);
          }
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

  const handleViewSent = async () => {
    try {
      if (!currentUser || !currentUser.refreshToken) {
        console.error('User not authenticated or missing token');
        return;
      }
  
      // Check if the user's ID token is available, if not, refresh it
      if (!currentUser.stsTokenManager.accessToken) {
        await currentUser.getIdToken(/* forceRefresh */ true);
      }
  
      // Now, the user's ID token should be available
      const response = await axiosSecure.get(`/messages/${originalId}`);
      
      // Check if the response has a 'messages' property, otherwise assume the data is the array of messages
      const messages = response.data.messages || response.data;
      
      // Ensure messages is an array or default to an empty array
      const messagesArray = Array.isArray(messages) ? messages : [];
  
      // Show a SweetAlert modal with messages
      const { value: messageText } = await Swal.fire({
        title: 'Comments',
        html: messagesArray.map((message) => `
          <p><strong>${message.currentUseremail}:</strong> ${message.text}</p>
        `).join(''),
        input: 'textarea',
        inputPlaceholder: 'Type your comment...',
        inputAttributes: {
          'aria-label': 'Type your comment here',
        },
        icon: 'info',
        background: '#180a38', // Dark background color
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#dc3545',
        confirmButtonText: 'Post',
        cancelButtonText: 'Cancel',
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            custom-faster
          `,
        },
      });
  
      // Check if the user clicked the "Send Message" button
      if (messageText && messageText.trim() !== '') {
        // Send the message to the server
        await sendUserMessage(messageText);
  
        // Show a success message after sending the message
        Swal.fire({
          title: 'Comment Posted',
          text: 'Your comment has been posted successfully.',
          icon: 'success',
          background: '#180a38',
          showCloseButton: true, // Allow users to close the success message
        });
      }
    } catch (error) {
      console.error('Error fetching or sending messages:', error.message);
      Swal.fire({
        title: 'Error',
        text: 'Failed to fetch or send messages. Please try again.',
        icon: 'error',
        background: '#180a38',
        showCloseButton: true, // Allow users to close the error message
      });
    }
  };
  
  
  
  const sendUserMessage = async (text) => {
    try {
      // Send the message to the server
      await axiosSecure.post(`/messages/${originalId}`, {
        currentUseremail: currentUser.email,
        text,
      });
    } catch (error) {
      console.error('Error sending message:', error.message);
      // Handle the error as needed
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
          <button
          onClick={handlePinClick}
          className="btn bg-yellow-500 text-white focus:outline-none mx-auto"
          style={{ border: 'none' }}
        >
          Pin
        </button>
        {/* <button
          onClick={handleviewsent}
          className="btn bg-yellow-500 text-white focus:outline-none mx-auto"
          style={{ border: 'none' }}
        >
          messages
        </button> */}

        </div>
      </div>
    </div>
  );
};

export default Cards;
