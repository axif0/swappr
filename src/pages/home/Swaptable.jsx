import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Cards from '../../components/Cards'; // Import the Cards component

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

  // Filter based on the search input
  const filteredSwapCourses = swapCourses.filter((swapCourse) =>
    swapCourse.dealerCourse.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between m-4">
        <input
          type="text"
          placeholder="Search Dealer Course"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="border rounded p-1"
        />
      </div>

      <div className="flex flex-wrap justify-start">
        {filteredSwapCourses.map((swapCourse, index) => (
          <Cards key={index} item={swapCourse} />
        ))}
      </div>
    </div>
  );
};

export default SwapCourses;
