import React, { useEffect, useContext, useState } from 'react';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthProvider';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const CourseSwap = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (!(await checkUserId())) {
      // If the user doesn't have a valid studentId, stop the form submission
      setErrorMessage('A Student ID is required to submit this form.');
      return;
    }

    // Modify the data object to match your Mongoose schema
    const swapRequestData = {
      dealerCourse: data.courseName,
      semester: data.semester,
      dealerSection: data.section,
      interestedCourse: [data.interestedCourse],
      interestedSections: [data.interestedSection],
      reward: data.reward,
    };

    axios
      .post('https://swapper-server.onrender.com/swap/add', swapRequestData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      })
      .then((response) => {
        alert('Swap course request added successfully!');
        navigate('/');
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage('Failed to add swap course request.');
      });
  };

  const checkStudentIdInDB = async (studentId) => {
    try {
      const response = await axiosSecure.get(`/studentInfo/student/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error while checking student ID:', error);
      return null;
    }
  };

  const promptForUniqueStudentId = async () => {
    let studentId = '';
    let email = '';
    let contact = '';

    while (true) {
      const result = await Swal.fire({
        title: 'Enter Your Details',
        html:
          '<input id="swal-input1" class="swal2-input" placeholder="Student ID">' +
          '<input id="swal-input3" class="swal2-input" placeholder="Contact">',
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        preConfirm: async () => {
          const value1 = document.getElementById('swal-input1').value;
          const value2 = user.email;
          const value3 = document.getElementById('swal-input3').value;

          if (!value1 || !value2 || !value3) {
            Swal.showValidationMessage('Please fill all fields');
          } else {
            const existingStudentId = await checkStudentIdInDB(value1);
            if (existingStudentId) {
              Swal.showValidationMessage('This student ID already exists. Please enter a unique one.');
            } else {
              return { studentId: value1, email: value2, contact: value3 };
            }
          }
        },
      });

      if (result.isConfirmed) {
        return result.value;
      } else {
        return null;
      }
    }
  };

  const checkUserId = async () => {
    if (user?.email && !user?.studentId) {
      try {
        await axiosSecure.get(`/studentInfo/${user.email}`);
        return true; // If the studentId exists, return true
      } catch (error) {
        const studentInfo = await promptForUniqueStudentId();

        if (!studentInfo) {
          return false; // If no studentInfo can be obtained, return false
        }

        await addStudentInfoToDB(studentInfo.studentId, studentInfo.email, studentInfo.contact);

        Swal.fire({
          title: 'Successfully created for ' + studentInfo.email,
          icon: 'success',
        });
        return true; // If everything is successful, return true
      }
    }
    return true; // If the user already has a studentId, return true
  };

  const addStudentInfoToDB = async (studentId, email, contact) => {
    try {
      await axiosSecure.post('/studentInfo/addStudentInfo', { studentId, email, contact });
    } catch (error) {
      console.error('Error while adding student info to the database:', error);
    }
  };

  useEffect(() => {
    checkUserId();
  }, [user]);

  return (
    <div className="section-container pt-10">
      
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto" style={{ maxWidth: '600px' }}>
        {/* ... */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-thewhite">Your Course Code*</span>
          </label>
          <input
            type="text"
            {...register("courseName", { required: true })}
            className="input input-bordered w-full"
            placeholder="e.g., ABC123"
          />
          {errors.courseName && (
            <p className="text-red-500">Course name is required.</p>
          )}
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-thewhite">Your Course Section*</span>
          </label>
          <input
            type="text"
            {...register("section", { required: true })}
            className="input input-bordered w-full"
            placeholder="e.g., A01"
          />
          {errors.section && (
            <p className="text-red-500">Section is required.</p>
          )}
        </div>

        {/* ... */}
        
        {/* ... */}
        
        {/* ... */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-thewhite">Interested Course*</span>
          </label>
          <input
            type="text"
            {...register("interestedCourse", { required: true })}
            className="input input-bordered w-full"
            placeholder="e.g., XYZ456"
          />
          {errors.interestedCourse && (
            <p className="text-red-500">Interested course is required.</p>
          )}
        </div>
        {/* ... */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-thewhite">Interested Section*</span>
          </label>
          <input
            type="text"
            {...register("interestedSection", { required: true })}
            className="input input-bordered w-full"
            placeholder="e.g., B02"
          />
          {errors.interestedSection && (
            <p className="text-red-500">Interested section is required.</p>
          )}
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-thewhite">Swap Reason*</span>
          </label>
          <input
            type="text"
            {...register("semester", { required: true })}
            className="input input-bordered w-full"
            placeholder="e.g., Need a different schedule"
          />
          {errors.semester && (
            <p className="text-red-500">Semester is required.</p>
          )}
        </div>

        {/* ... */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-thewhite">Reward*</span>
          </label>
          <input
            type="text"
            {...register("reward", { required: true })}
            className="input input-bordered w-full"
            placeholder="e.g., $50 Amazon gift card"
          />
          {errors.reward && (
            <p className="text-red-500">Reward is required.</p>
          )}
        </div>
        {/* ... */}
        {errorMessage && (
          <div className="text-red-500 mb-4">{errorMessage}</div>
        )}
  
        <div className="pt-4">
          <button 
            type="submit"
            className="btn bg-green text-white px-6"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
  
  
};

export default CourseSwap;
