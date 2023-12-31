import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FaTrashAlt, FaExchangeAlt } from "react-icons/fa";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
 
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

  // const handleDeleteSwapCourse = async (swapCourse) => {
  //   try {
  //     // Optimistically update the UI
  //     const newSwapCourses = swapCourses.filter(sc => sc._id !== swapCourse._id);
  //     // Update state or context with newSwapCourses here
  
  //     const res = await axiosSecure.delete(`/swap/delete/${swapCourse._id}`);
  //     alert(`Swap course for user ${swapCourse.user} is removed from database`);
     
  
  //     // Optionally refetch if you want to confirm the server state
  //     refetch();
  //   } catch (error) {
  //     console.log(swapCourse._id)
  //     alert('Failed to delete swap course. Please try again.');
  //     // Revert optimistic update if necessary
  //   }
  // }
  

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
              {/* <th>Action</th> */}
            </tr>
          </thead>
          <tbody>
            {swapCourses.map((swapCourse, index) => (
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
