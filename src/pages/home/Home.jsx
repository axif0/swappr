import React, { useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import Banner from '../../components/Banner';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthProvider';

const Home = () => {
 
  return (
    <div>
      <Banner />
      {/* Rest of your Home component */}
    </div>
  );
};

export default Home;
