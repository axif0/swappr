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
      .post("https://swapper-server.onrender.com/swap/add", swapRequestData, {
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
    <div className="section-container">
      <h2 className="text-2xl font-semibold my-4 text-center">
        Add Swap Course Request
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto" style={{ maxWidth: '870px' }}>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Course Name*</span>
          </label>
          <input
            type="text"
            {...register("courseName", { required: true })}
            className="input input-bordered w-full"
          />
          {errors.courseName && (
            <p className="text-red-500">Course name is required.</p>
          )}
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Why Swap*</span>
          </label>
          <input
            type="text"
            {...register("semester", { required: true })}
            className="input input-bordered w-full"
          />
          {errors.semester && (
            <p className="text-red-500">Semester is required.</p>
          )}
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Section*</span>
          </label>
          <input
            type="text"
            {...register("section", { required: true })}
            className="input input-bordered w-full"
          />
          {errors.section && (
            <p className="text-red-500">Section is required.</p>
          )}
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Interested Course*</span>
          </label>
          <input
            type="text"
            {...register("interestedCourse", { required: true })}
            className="input input-bordered w-full"
          />
          {errors.interestedCourse && (
            <p className="text-red-500">Interested course is required.</p>
          )}
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Interested Section*</span>
          </label>
          <input
            type="text"
            {...register("interestedSection", { required: true })}
            className="input input-bordered w-full"
          />
          {errors.interestedSection && (
            <p className="text-red-500">Interested section is required.</p>
          )}
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Reward*</span>
          </label>
          <input
            type="text"
            {...register("reward", { required: true })}
            className="input input-bordered w-full"
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
          className="btn bg-green text-white px-6"
        >
          Submit Swap Request
        </button>
      </form>
    </div>
  );
};

export default CourseSwap;