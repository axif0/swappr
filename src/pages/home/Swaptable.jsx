import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Cards from '../../components/Cards';

const SwapCourses = () => {
  const axiosSecure = useAxiosSecure();
  const [mergedData, setMergedData] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const { data: swapCourses = [] } = useQuery({
    queryKey: ["swapCourses"],
    queryFn: async () => {
      const res = await axiosSecure.get("/swap");
      return res.data;
    },
  });

  useEffect(() => {
    const mergeData = async () => {
      const promises = swapCourses.map(async (swapCourse) => {
        try {
          const res = await axiosSecure.get(`/studentInfo/${swapCourse.user}`);
          return { ...swapCourse, ...res.data };
        } catch (error) {
          console.error("Error fetching student info:", error);
          return { ...swapCourse }; // return original swapCourse in case of error
        }
      });

      const mergedCourses = await Promise.all(promises);
      setMergedData(mergedCourses);
    };

    if (swapCourses.length > 0) {
      mergeData();
    }
  }, [swapCourses, axiosSecure]);

  const filteredSwapCourses = mergedData.filter((swapCourse) =>
    swapCourse.dealerCourse.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="container mx-auto p-7 pr-0">
    <div className="flex items-center justify-start mt-20">
        <input
          type="text"
          placeholder="Search Dealer Course"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="border rounded p-1"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredSwapCourses.map((swapCourse, index) => (
          <Cards key={index} item={swapCourse} />
        ))}
      </div>
    </div>
  );
};

export default SwapCourses;
