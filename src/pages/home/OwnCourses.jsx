import React, { useState, useContext, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { AuthContext } from '../../contexts/AuthProvider';
import { FaTrashAlt, FaEdit, FaCheck } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner'; // Import the LoadingSpinner component
import Swal from 'sweetalert2';

const EditUserSwapCourses = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const { refetch, data: swapCourses = [], isLoading, error } = useQuery({
    queryKey: user ? ['swapCourses', user.email] : null,
    queryFn: async () => {
      try {
        if (!user || !user.email) {
          throw new Error('User is not authenticated or missing email');
        }

        // Fetch swap courses using your server endpoint
        const res = await axiosSecure.get(`/swap/${user.email}`);
        return res.data;
      } catch (error) {
        throw new Error('An error occurred while fetching swap courses');
      }
    },
    enabled: !!user,
  });

  // State to track which row is being edited
  const [editModeIndex, setEditModeIndex] = useState(null);
  const [editedCourse, setEditedCourse] = useState({});

  const handleEditSwapCourse = (swapCourse, index) => {
    setEditedCourse({ ...swapCourse });
    setEditModeIndex(index); // Set the index of the row to be edited
  };

  const handleCancelEdit = () => {
    setEditModeIndex(null); // Cancel edit mode
  };

  const handleDeleteSwapCourse = async (swapCourse) => {
    try {
      // Optimistically update the UI
      const newSwapCourses = swapCourses.filter(sc => sc._id !== swapCourse._id);
      // Update state or context with newSwapCourses here

      const res = await axiosSecure.delete(`/swap/delete/${swapCourse._id}`);
      alert(`Swap course for user ${editedCourse.user} is removed from the database`);

      // Optionally refetch if you want to confirm the server state
      refetch();
    } catch (error) {
      alert('Failed to delete swap course. Please try again.');
      // Revert optimistic update if necessary
    }
  };

  const handleUpdateSwapCourse = async () => {
    try {
      // Extract only the fields you want to update
      const { semester, dealerCourse, dealerSection, interestedCourse, interestedSections, isAvailable, reward } = editedCourse;
      await axiosSecure.put(`/swap/edit/${editedCourse._id}`, {
        semester,
        dealerCourse,
        dealerSection,
        interestedCourse,
        interestedSections,
        isAvailable,
        reward,
      });
      alert(`Swap course for user ${editedCourse.user} is updated`);
      setEditModeIndex(null);
      refetch();
    } catch (error) {
      console.error(error);
      alert('Failed to update swap course. Please try again.');
    }
  };

  useEffect(() => {
    if (user) {
      console.log('Decoded Token:', user);
    }
  }, [user]);

  if (isLoading) return <LoadingSpinner />; // Render the LoadingSpinner while data is loading
  if (error) return `An error occurred: ${error.message}`;

  return (
    <div className="p-4 pt-12 pl-8">
      <div className="flex items-center justify-between m-4"></div>

      <div className="flex flex-wrap justify-start">
        {swapCourses.map((swapCourse, index) => (
          <div
            key={swapCourse._id}
            className={`card bg-gray-800 shadow-xl relative mr-5 md:my-5 ${editModeIndex === index ? 'lg:h-full' : 'lg:w-72'}`}
            style={{ width: '350px', height: editModeIndex === index ? 'auto' : '400px' }}
          >
            <div className={`absolute right-2 bottom-2 left-2 p-4 flex justify-between items-end`}>
              {/* ... */}
            </div>

            <div className="card-body">
              {editModeIndex === index ? (
                <>
                  <div className="mb-2">
                    <label className="block mb-1 text-white font-bold">Your Course Code</label>
                    <input
                      type="text"
                      value={editedCourse.dealerCourse}
                      onChange={(e) => setEditedCourse({ ...editedCourse, dealerCourse: e.target.value })}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block mb-1 text-white font-bold">Your Course Section</label>
                    <input
                      type="text"
                      value={editedCourse.dealerSection}
                      onChange={(e) => setEditedCourse({ ...editedCourse, dealerSection: e.target.value })}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block mb-1 text-white font-bold">Interested Course</label>
                    <input
                      type="text"
                      value={editedCourse.interestedCourse.join(', ')}
                      onChange={(e) => setEditedCourse({ ...editedCourse, interestedCourse: e.target.value.split(', ') })}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </div>
                  
                  <div className="mb-2">
                    <label className="block mb-1 text-white font-bold">Interested Section</label>
                    <input
                      type="text"
                      value={editedCourse.interestedSections.join(', ')}
                      onChange={(e) => setEditedCourse({ ...editedCourse, interestedSections: e.target.value.split(', ') })}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block mb-1 text-white font-bold">Swap Reason</label>
                    <input
                      type="text"
                      value={editedCourse.semester}
                      onChange={(e) => setEditedCourse({ ...editedCourse, semester: e.target.value })}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block mb-1 text-white font-bold">Reward</label>
                    <input
                      type="text"
                      value={editedCourse.reward}
                      onChange={(e) => setEditedCourse({ ...editedCourse, reward: e.target.value })}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block mb-1 text-white font-bold">Availability</label>
                    <select
                      value={editedCourse.isAvailable ? 'Yes' : 'No'}
                      onChange={(e) => setEditedCourse({ ...editedCourse, isAvailable: e.target.value === 'Yes' })}
                      className="w-full px-2 py-1 border rounded"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      onClick={handleUpdateSwapCourse}
                      className="btn bg-yellow-500 text-white flex items-center font-bold"
                    >
                      <FaCheck className="mr-1" /> Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="btn bg-gray-500 text-white flex items-center font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                // Render text for cards not in edit mode
                <>
<h5 className="card-title text-purple-300 font-bold">{swapCourse.user}</h5>
                  <p></p>
                  <p className="text-white font-bold">Have → {swapCourse.dealerCourse} ({swapCourse.dealerSection})</p>

                  <p className="text-white font-bold">Need → {swapCourse.interestedCourse.map((course, index) => (
                    `${course} (${swapCourse.interestedSections[index]})`
                  )).join(', ')}</p>

                  <p className="text-white font-bold">Swap Reason → {swapCourse.semester}</p>
                  
                  <p className="text-white font-bold">Reward → {swapCourse.reward}</p>

                  <p className="text-white font-bold">Availability → {swapCourse.isAvailable ? 'Yes' : 'No'}</p>

                  <div className="flex justify-end space-x-2 mt-2">
                    <button onClick={() => handleDeleteSwapCourse(swapCourse)} className="btn bg-orange-500 text-white flex items-center font-bold">
                      <FaTrashAlt className="mr-1" /> Delete
                    </button>
                    <button onClick={() => handleEditSwapCourse(swapCourse, index)} className="btn bg-blue-500 text-white flex items-center font-bold">
                      <FaEdit className="mr-1" /> Edit
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditUserSwapCourses;