import React, { useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import Banner from '../../components/Banner';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthProvider';

const Home = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

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
        showCancelButton: true, // This shows the cancel button
        cancelButtonText: 'Cancel',
        preConfirm: async () => {
          const value1 = document.getElementById('swal-input1').value;
          const value2 =user.email
          const value3 = document.getElementById('swal-input3').value;
  
          if (!value1 || !value2 || !value3) {
            Swal.showValidationMessage('Please fill all fields');
          } else {
            const existingStudentId = await checkStudentIdInDB(value1);
            if (existingStudentId) {
              Swal.showValidationMessage('This student ID already exists. Please enter a unique one.');
            } else {
              return [value1, value2, value3];
            }
          }
        },
      });
  
      if (result.isConfirmed) {
        [studentId, email, contact] = result.value;
        break;
      } else {
        return null;
      }
    }
  
    return { studentId, email, contact };
  };
  const checkUserId = async () => {
    if (user?.email && !user?.studentId) {
      try {
        const existingStudentInfo = await axiosSecure.get(`/studentInfo/${user.email}`);
        console.log('Already exists email', existingStudentInfo);
      } catch (error) {
        const studentInfo = await promptForUniqueStudentId();
  
        if (!studentInfo) {
          return;
        }
  
        await addStudentInfoToDB(studentInfo.studentId, studentInfo.email, studentInfo.contact);
  
        Swal.fire({
          title: 'Successfully created for ' + studentInfo.email,
          icon: 'success',
        });
      }
    }
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
    <div>
      <Banner />
      {/* Rest of your Home component */}
    </div>
  );
};

export default Home;
