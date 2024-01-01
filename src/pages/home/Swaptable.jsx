import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const SwapCourses = () => {
  const axiosSecure = useAxiosSecure();
  const { refetch, data: swapCourses = [] } = useQuery({
    queryKey: ["swapCourses"],
    queryFn: async () => {
      const res = await axiosSecure.get("/swap");
      return res.data;
    },
  });

  const [searchInput, setSearchInput] = useState("");
  const [editRowIndex, setEditRowIndex] = useState(null); // New state to track editing row

  // Only show the row that is being edited, based on editRowIndex
  const filteredSwapCourses = editRowIndex !== null ? [swapCourses[editRowIndex]] : swapCourses.filter((swapCourse) =>
    swapCourse.dealerCourse.toLowerCase().includes(searchInput.toLowerCase())
  );

  const handleEditClick = (index) => {
    setEditRowIndex(index); // Set the current row to be editable
  };

  const handleSave = () => {
    // Save logic here...
    setEditRowIndex(null); // Reset the editRowIndex to show all rows again
    refetch();
  };

  const handleCancel = () => {
    setEditRowIndex(null); // Reset the editRowIndex to show all rows again
  };

  return (
    <div>
      <div className="flex items-center justify-between m-4">
        <div>
          <h5>All Swap Courses</h5>
          <h5>Total Swap Courses: {swapCourses.length}</h5>
        </div>
        <div>
          {/* Search input field */}
          <input
            type="text"
            placeholder="Search Dealer Course"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="border rounded p-1"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra md:w-[870px]">
          <thead className="bg-green text-white rounded-lg">
            <tr>
              <th>#</th>
              <th>User ID</th>
              <th>Why swap</th>
              <th>Dealer Course</th>
              <th>Dealer Section</th>
              <th>Interested Course</th>
              <th>Interested Sections</th>
              <th>Is Available</th>
              <th>Reward</th>
              {/* <th>Action</th> */}
            </tr>
          </thead>
          <tbody>
            {filteredSwapCourses.map((swapCourse, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{swapCourse.user}</td>
                <td>{swapCourse.semester}</td>
                <td>{swapCourse.dealerCourse}</td>
                <td>{swapCourse.dealerSection}</td>
                <td>{swapCourse.interestedCourse.join(", ")}</td>
                <td>{swapCourse.interestedSections.join(", ")}</td>
                <td>{swapCourse.isAvailable ? "Yes" : "No"}</td>
                <td>{swapCourse.reward}</td>
                {/* <td>
                  <button onClick={() => handleDeleteSwapCourse(swapCourse)} className="btn btn-xs bg-orange-500 text-white">
                    <FaTrashAlt />
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );



  
};

export default SwapCourses;
