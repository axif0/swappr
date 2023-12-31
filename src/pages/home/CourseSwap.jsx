import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CourseSwap = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // Modify the data object to match your Mongoose schema
    const swapRequestData = {
      dealerCourse: data.courseName,
      semester: data.semester,
      dealerSection: data.section,
      interestedCourse: [data.interestedCourse], // Wrap in an array
      interestedSections: [data.interestedSection], // Wrap in an array
      reward: data.reward, // Use the reward value from the form
    };

    axios
      .post("http://localhost:6001/swap/add", swapRequestData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
      })
      .then((response) => {
        alert("Swap course request added successfully!");
        navigate("/"); // Redirect to the homepage or any desired page
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage("Failed to add swap course request.");
      });
  };

  return (
    <div className="max-w-md bg-white shadow w-full mx-auto p-4">
      <h3 className="font-bold text-lg mb-4">Add Swap Course Request</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Course Name
          </label>
          <input
            type="text"
            {...register("courseName", { required: true })}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
          {errors.courseName && (
            <p className="text-red-500">Course name is required.</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Semester
          </label>
          <input
            type="text"
            {...register("semester", { required: true })}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
          {errors.semester && (
            <p className="text-red-500">Semester is required.</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Section
          </label>
          <input
            type="text"
            {...register("section", { required: true })}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
          {errors.section && (
            <p className="text-red-500">Section is required.</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Interested Course
          </label>
          <input
            type="text"
            {...register("interestedCourse", { required: true })}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
          {errors.interestedCourse && (
            <p className="text-red-500">Interested course is required.</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Interested Section
          </label>
          <input
            type="text"
            {...register("interestedSection", { required: true })}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
          {errors.interestedSection && (
            <p className="text-red-500">Interested section is required.</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Reward
          </label>
          <input
            type="text"
            {...register("reward", { required: true })}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
          {errors.reward && (
            <p className="text-red-500">Reward is required.</p>
          )}
        </div>

        {errorMessage && (
          <div className="text-red-500 mb-4">{errorMessage}</div>
        )}

        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CourseSwap;
