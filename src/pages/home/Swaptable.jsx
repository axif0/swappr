import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Cards from "../../components/Cards";
import LoadingSpinner from "../../components/LoadingSpinner";

const SwapCourses = () => {
  const axiosSecure = useAxiosSecure();
  const { refetch, data: swapCourses = [], isLoading } = useQuery({
    queryKey: ["swapCourses"],
    queryFn: async () => {
      const res = await axiosSecure.get("/swap");
      return res.data;
    },
  });

  const [searchInput, setSearchInput] = useState("");
  const [mergedData, setMergedData] = useState([]);

  // Memoize mergeData function
  const mergeData = useMemo(
    () => async () => {
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
    },
    [swapCourses, axiosSecure]
  );

  // Use debounced search input for filtering
  const [debouncedSearchInput, setDebouncedSearchInput] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchInput(searchInput);
    }, 300); // Adjust the delay as needed

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Filter based on the debounced search input
  const filteredSwapCourses = mergedData.filter((swapCourse) =>
    swapCourse.dealerCourse.toLowerCase().includes(debouncedSearchInput.toLowerCase())
  );

  useEffect(() => {
    if (swapCourses.length > 0) {
      mergeData();
    }
  }, [swapCourses, mergeData]);

  return (
    <div className="container mx-auto p-7 pr-0 ">
      <div className="flex items-center justify-start mt-14 mb-3 pt-5">
        <input
          type="text"
          placeholder="Search courses"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="input input-bordered input-info w-full max-w-[20rem] p-5"
        />
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredSwapCourses.map((swapCourse, index) => (
            <Cards key={index} item={swapCourse} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SwapCourses;
