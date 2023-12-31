import React, { useState, useContext, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { AuthContext } from '../../contexts/AuthProvider';
import { FaTrashAlt ,FaEdit, FaCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';

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

  const [editMode, setEditMode] = useState(false);
  const [editedCourse, setEditedCourse] = useState({});

  const handleEditSwapCourse = (swapCourse) => {
    setEditMode(true);
    setEditedCourse({ ...swapCourse });
  };
  const handleDeleteSwapCourse = async (swapCourse) => {
    try {
      // Optimistically update the UI
      const newSwapCourses = swapCourses.filter(sc => sc._id !== swapCourse._id);
      // Update state or context with newSwapCourses here
  
      const res = await axiosSecure.delete(`/swap/delete/${swapCourse._id}`);
      alert(`Swap course for user ${swapCourse.user} is removed from database`);
     
  
      // Optionally refetch if you want to confirm the server state
      refetch();
    } catch (error) {
      
      alert('Failed to delete swap course. Please try again.');
      // Revert optimistic update if necessary
    }
  }
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
      setEditMode(false);
      refetch();
    } catch (error) {
      alert('Failed to update swap course. Please try again.');
    }
  };

  useEffect(() => {
    if (user) {
      console.log('Decoded Token:', user);
    }
  }, [user]);

  if (isLoading) return 'Loading...';
  if (error) return `An error occurred: ${error.message}`;

  return (
    <div>
      <div className="flex items-center justify-between m-4">
        <h5>All Swap Courses</h5>
        <h5>Total Swap Courses: {swapCourses.length}</h5>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra md:w-[870px]">
          <thead className="bg-green text-white rounded-lg">
            <tr>
              <th>#</th>
              <th>User ID</th>
              <th>Semester</th>
              <th>Dealer Course</th>
              <th>Dealer Section</th>
              <th>Interested Course</th>
              <th>Interested Sections</th>
              <th>Is Available</th>
              <th>Reward</th>
              <th>Action</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {swapCourses.map((swapCourse, index) => (
              <tr key={swapCourse._id}>
                <th scope="row">{index + 1}</th>
                <td>{swapCourse.user}</td>
                <td>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedCourse.semester}
                      onChange={(e) => setEditedCourse({ ...editedCourse, semester: e.target.value })}
                    />
                  ) : (
                    swapCourse.semester
                  )}
                </td>
                <td>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedCourse.dealerCourse}
                      onChange={(e) => setEditedCourse({ ...editedCourse, dealerCourse: e.target.value })}
                    />
                  ) : (
                    swapCourse.dealerCourse
                  )}
                </td>
                <td>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedCourse.dealerSection}
                      onChange={(e) => setEditedCourse({ ...editedCourse, dealerSection: e.target.value })}
                    />
                  ) : (
                    swapCourse.dealerSection
                  )}
                </td>
                <td>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedCourse.interestedCourse.join(', ')}
                      onChange={(e) => setEditedCourse({ ...editedCourse, interestedCourse: e.target.value.split(', ') })}
                    />
                  ) : (
                    swapCourse.interestedCourse.join(', ')
                  )}
                </td>
                <td>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedCourse.interestedSections.join(', ')}
                      onChange={(e) =>
                        setEditedCourse({ ...editedCourse, interestedSections: e.target.value.split(', ') })
                      }
                    />
                  ) : (
                    swapCourse.interestedSections.join(', ')
                  )}
                </td>
                <td>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedCourse.isAvailable ? 'Yes' : 'No'}
                      onChange={(e) => setEditedCourse({ ...editedCourse, isAvailable: e.target.value.toLowerCase() === 'yes' })}
                    />
                  ) : (
                    swapCourse.isAvailable ? 'Yes' : 'No'
                  )}
                </td>
                <td>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedCourse.reward}
                      onChange={(e) => setEditedCourse({ ...editedCourse, reward: e.target.value })}
                    />
                  ) : (
                    swapCourse.reward
                  )}
                </td>
                <td>
                  {!editMode && (
                    <button onClick={() => handleDeleteSwapCourse(swapCourse)} className="btn btn-xs bg-orange-500 text-white">
                      <FaTrashAlt />
                    </button>
                  )}
                </td>
                <td>

                  {editMode ? (
                    <button onClick={handleUpdateSwapCourse} className="btn btn-xs bg-green-500 text-white">
                      <FaCheck />
                    </button>
                  ) : (
                    <button onClick={() => handleEditSwapCourse(swapCourse)} className="btn btn-xs bg-orange-500 text-white">
                      <FaEdit />
                    </button>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EditUserSwapCourses;
