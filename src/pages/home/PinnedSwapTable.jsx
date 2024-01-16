import React, { useState, useContext, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { AuthContext } from '../../contexts/AuthProvider';
import { FaEnvelope,FaTrashAlt, FaEdit } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner'; // Import the LoadingSpinner component
import Swal from 'sweetalert2';
 

const PinnedSwapTable = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const { user: currentUser } = useContext(AuthContext);
  const { refetch, data: pinnedCourses = [], isLoading, error } = useQuery({
    queryKey: user ? ['pinnedCourses', user.email] : null,
    queryFn: async () => {
      try {
        if (!user || !user.email) {
          throw new Error('User is not authenticated or missing email');
        }

        // Fetch pinned courses using your server endpoint
        const res = await axiosSecure.get(`studentInfo//pinnedCourses/${user.email}`);
        return res.data.pinnedCourses;
      } catch (error) {
        throw new Error('An error occurred while fetching pinned courses');
      }
    },
    enabled: !!user,
  });
  const handleSendEmail = (userEmail) => {
    // Show a SweetAlert modal for email confirmation
    Swal.fire({
      title: 'Send Email',
      text: `Are you sure you want to send an email to ${userEmail}?`,
      icon: 'question',
      background: '#180a38',
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Yes, send email!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // Show a SweetAlert modal for editing the email content
        Swal.fire({
          title: 'Compose Email',
          input: 'textarea',
          inputPlaceholder: `Type your email content here...\n\nCard Information:\n${user}`,
          inputAttributes: {
            'aria-label': 'Type your email content here',
          },
          icon: 'info',
          background: '#180a38',
          showCloseButton: true,
          showCancelButton: true,
          confirmButtonColor: '#28a745',
          cancelButtonColor: '#dc3545',
          confirmButtonText: 'Send Email',
          cancelButtonText: 'Cancel',
          showClass: {
            popup: `
              animate__animated
              animate__fadeInUp
              custom-faster
            `,
          },
        }).then((result) => {
          if (result.isConfirmed && result.value.trim() !== '') {
            // Send the email
            sendEmail(userEmail, result.value);
          }
        });
      }
    });
  };

  const sendEmail = async (to, content) => {
    try {
      // Send the email using your server endpoint
      await axiosSecure.post('/email/send', { to, subject: 'Subject', text: content });

      // Show a success message after sending the email
      Swal.fire({
        title: 'Email Sent',
        text: 'Your email has been sent successfully.',
        icon: 'success',
        background: '#180a38',
        showCloseButton: true,
      });
    } catch (error) {
      console.error('Error sending email:', error.message);
      // Show an error message if sending the email fails
      Swal.fire({
        title: 'Error',
        text: 'Failed to send email. Please try again.',
        icon: 'error',
        background: '#180a38',
        showCloseButton: true,
      });
    }
  };

  const handleViewSent = async (originalId) => {
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
        html: `
          <div class="text-white" style="max-height: 300px; overflow-y: auto;">
            ${messagesArray.map((message) => `
              <div style="margin-bottom: 10px;">
                <strong class="font-bold" style="color: skyblue;">
                  ${message.currentUseremail}:
                </strong>
                <span style="word-break: break-word; display: inline-block; max-width: calc(100% - 20px);">
                  ${message.text}
                </span>
              </div>
            `).join('')}
          </div>
        `,
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
        await sendUserMessage(originalId,messageText);
  
        // Show a success message after sending the message
        Swal.fire({
          title: 'Message Sent',
          text: 'Your message has been sent successfully.',
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
  
  const sendUserMessage = async (originalId,text) => {
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

  const handleDeletePinnedCourse = async (pinnedCourse) => {
    try {
      // Optimistically update the UI
      const newPinnedCourses = pinnedCourses.filter(pc => pc._id !== pinnedCourse._id);
      // Update state or context with newPinnedCourses here

    console.log()

      const res = await axiosSecure.delete(`https://swapper-server.onrender.com/studentInfo/pinnedCourses/delete/${user.email}/${pinnedCourse._id}`);
      alert(`Pinned course for user ${user.email} is removed from the database`);

      // Optionally refetch if you want to confirm the server state
      refetch();
    } catch (error) {
      alert('Failed to delete pinned course. Please try again.');
      // Revert optimistic update if necessary
    }
  };
 
  const [isHeartFilled, setIsHeartFilled] = useState(false);

  const handleHeartClick = () => {
    setIsHeartFilled(!isHeartFilled);
  };

  return (
    <div className="p-4 pt-12 pl-8">
      <div className="flex items-center justify-between m-4"></div>

      <div className="flex flex-wrap justify-start">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          pinnedCourses.map((pinnedCourse) => (
            <div
              key={pinnedCourse._id}
              className="card bg-gray-800 shadow-xl relative mr-5 md:my-5 lg:w-72"
              style={{ width: '350px', height: '400px' }}
            >
              <div
                className={`absolute right-2 top-2 p-4 ${
                  isHeartFilled ? 'text-rose-500' : 'text-white'
                }`}
                onClick={handleHeartClick}
              >
                {/* Heart icon or any other icon */}
              </div>

              <div className="card-body">
  <>
    <h5 className="card-title text-purple-300 font-bold">
      {pinnedCourse.user}
    </h5>
    <p className="text-white font-bold">
      Have → {pinnedCourse.dealerCourse} ({pinnedCourse.dealerSection})
    </p>
    <p className="text-white font-bold">
      Need →{' '}
      {pinnedCourse.interestedCourse.map((course, index) => (
        `${course} (${pinnedCourse.interestedSections[index]})`
      )).join(', ')}
    </p>
    <p className="text-white font-bold">
      Swap Reason → {pinnedCourse.semester}
    </p>
    <p className="text-white font-bold">
      Reward → {pinnedCourse.reward}
    </p>
    <p className="text-white font-bold">
      Availability → {pinnedCourse.isAvailable ? 'Yes' : 'No'}
    </p>

    <div className="flex justify-end space-x-2 mt-2">
    <button
  onClick={() => handleViewSent(pinnedCourse._id)}
  className="btn bg-mygreen text-white focus:outline-none mx-auto"
  style={{ border: 'none' }}
>
  Comment
</button>

      <button
        onClick={() => handleDeletePinnedCourse(pinnedCourse)}
        className="btn bg-orange-500 text-white flex items-center font-bold"
      >
        <FaTrashAlt className="mr-1" />  
      </button>
       {/* Notification icon to send email */}
       <button
                    onClick={() => handleSendEmail(pinnedCourse.user)}
                    className="btn bg-blue-500 text-white flex items-center font-bold"
                  >
                    📧 Notify
                  </button>
    </div>
  </>
</div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PinnedSwapTable;


