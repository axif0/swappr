import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthProvider';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';

const UserProfile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [contact, setContact] = useState('');

  useEffect(() => {
    // Fetch the initial contact from the user data
    if (user) {
      setValue('name', user.displayName || ''); // Display Name (if available)
      setContact(user.contact || ''); // Contact (if available)
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    const name = data.name;

    try {
      // Update contact in the database
      const response = await axios.put(`https://swapper-server.onrender.com/studentInfo/updateContact/${user.email}`, { contact });

      console.log(response)
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Contact updated successfully',
        });

      } else {
        throw new Error('Failed to update contact');
      }

      // Update user profile
      await updateUserProfile(name);
      Swal.fire({
        icon: 'success',
        title: 'Profile updated successfully',
      });
      // Profile and contact updated successfully!
      // alert('Profile updated successfully');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error updating profile and contact!',
      });
      console.error('Error updating profile and contact:', error);
    }
  };

  return (
    <div className="h-screen max-w-md mx-auto flex items-center justify-center">
      <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Student ID</span>
            </label>
            <input
              type="text"
              value={user?.studentId || ''}
              className="input input-bordered"
              disabled
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="text"
              value={user?.email || ''}
              className="input input-bordered"
              disabled
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              {...register('name')}
              placeholder="Your name"
              className="input input-bordered"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Contact</span>
            </label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="input input-bordered"
              placeholder="Your contact"
            />
          </div>
          <div className="form-control mt-6">
            <input type="submit" value={'Update'} className="btn bg-green text-white" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
