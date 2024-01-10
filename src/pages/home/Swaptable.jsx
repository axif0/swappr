import React, { useState, useEffect, useMemo,useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Cards from "../../components/Cards";
import LoadingSpinner from "../../components/LoadingSpinner";
import axios from 'axios'; // Import axios here
import Swal from 'sweetalert2';
import { AuthContext } from '../../contexts/AuthProvider';

const SwapCourses = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const { refetch, data: swapCourses = [], isLoading } = useQuery({
    queryKey: ["swapCourses"],
    queryFn: async () => {
      const res = await axiosSecure.get("/swap");
      return res.data;
    },
  });

  const addPinnedCourse = async (email, swapRequestIds) => {
    try {
      // console.log("mama",swapRequestIds);
      console.log("email",user.email)
      if (!user || !user.email) {
        console.error("Current user is not authenticated or missing email");
        return;
      }

      // Assuming email is in swapCourses.user property, modify if needed
      const response = await axios.post(`https://swapper-server.onrender.com/studentInfo/addSwapRequests/${user.email}`, {
        swapRequestIds: swapRequestIds,
      });
      console.log("print",response)
  
      if (response.status === 200) {
        // The pinned course has been successfully added
        // Optionally, you can refetch data if needed
        refetch();
  
        // Show a success alert
        Swal.fire({
          title: 'Success!',
          text: 'Course pinned successfully.',
          icon: 'success',
          background: '#180a38', // Dark background color
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
       
        console.error("Failed to add pinned course:", response.data.message);
      }
    } catch (error) {
      Swal.fire({
        title: 'Failed!',
        text: 'Failed to add pinned course.',
        icon: 'error', // Set icon to error
        background: '#180a38', // Dark background color
        showCloseButton: true,
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            custom-faster
          `,
        },
      });
      console.error("Error adding pinned course duplicated or check it carefully:", error.message);
    }
  };
  
  
  const [searchInput, setSearchInput] = useState("");
  const [mergedData, setMergedData] = useState([]);

  // Memoize mergeData function
  const mergeData = useMemo(
    () => async () => {
      const promises = swapCourses.map(async (swapCourse) => {
        try {
          const res = await axiosSecure.get(`/studentInfo/${swapCourse.user}`);
          return { ...swapCourse, ...res.data, originalId: swapCourse._id };
        } catch (error) {
          console.error("Error fetching student info:", error);
          return { ...swapCourse, originalId: swapCourse._id };
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
 {filteredSwapCourses.map((swapCourse, index) => {
   
  return <Cards key={index} item={swapCourse} addPinnedCourse={addPinnedCourse} />;
})}


        </div>
      )}
    </div>
  );
};

export default SwapCourses;
