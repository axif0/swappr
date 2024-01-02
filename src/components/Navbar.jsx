import React, { useEffect, useState } from "react";
import logo from "/logo.png";
import { FaRegUser } from "react-icons/fa";
import Modal from "./Modal";
import Profile from "./Profile";
import { Link, useParams, useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";
import axios from 'axios';
 
const Navbar = () => {
  const [isSticky, setSticky] = useState(false);
  const [isScreenShrunk, setIsScreenShrunk] = useState(false); // New state for screen width
  const { user, loading } = useAuth();
  const [cart, refetch] = useCart();
  const navigate = useNavigate();
  const { userId } = useParams();
   
  useEffect(() => {
    const handleResize = () => {
      // Update the state based on the screen width
      setIsScreenShrunk(window.innerWidth <= 768); // You can adjust the threshold as needed
    };

    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 0) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    // Initial call to handleResize
    handleResize();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleCreateSwapRequest = () => {
    navigate("/course-swap");
  };

  const navItems = (
    <>
      <li>
        <a href="/" className="text-green">
          Home
        </a>
      </li>
      <li>
        <Link to="/swaptable" className="text-green">
          Available Deals
        </Link>
      </li>
      <li>
        <Link to={`/swap/${userId}`} className="text-green">
          My Deals
        </Link>
      </li>
    </>
  );

  return (
    <header
      className={`max-w-screen-2xl container mx-auto fixed top-0 left-0 right-0 transition-all duration-300 ease-in-out`}
    >
      <div
        className={`navbar xl:auto`}
        style={{
          backgroundColor: isSticky ? '#1c1c21' : '',
          boxShadow: isSticky ? '0px 0px 10px rgba(0, 0, 0, 0.1)' : '',
          transition: 'background-color 0.3s, box-shadow 0.3s',
        }}
      >
        <div className="navbar-start pl-5">
          <div className="dropdown justify-between">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-64 space-y-3"
            >
              {navItems}
            </ul>
          </div>
          <a href="/">
            <img src={logo} alt=""  />
          </a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{navItems}</ul>
        </div>
        <div className="navbar-end pr-5">
          {user ? (
            <>
              <button
                onClick={handleCreateSwapRequest}
                className="btn btn-primary"
                style={{
                  marginRight: '15px',
                  color: '#ffffff',
                  backgroundColor: isScreenShrunk ? 'black' : '#000000', // Set the button background color
                }}
              >
                {isScreenShrunk ? 'Create' : 'Create New Deal'}
              </button>
              <Profile user={user} />
            </>
          ) : (
            <button
              onClick={() => document.getElementById('my_modal_5').showModal()}
              className="btn flex items-center gap-2 rounded-full px-6 bg-green text-white"
            >
              <FaRegUser /> Login
            </button>
          )}
          <Modal />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
