import React, { useEffect, useState } from "react";
import logo from "/logo.png";
import { FaRegUser } from "react-icons/fa";
import Modal from "./Modal";
import Profile from "./Profile";
import { Link, useParams, useNavigate } from "react-router-dom";// Import useParams
import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";
import axios from 'axios';
 
const Navbar = () => {
  const [isSticky, setSticky] = useState(false);
  const { user, loading } = useAuth();
  const [cart, refetch] = useCart();
  const navigate = useNavigate(); // Initialize useNavigate
  const { userId } = useParams(); // Extract userId from the URL using useParams
   
  useEffect(() => {
    // Fetch the current semester from the server or your state management solution
     

    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 0) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleCreateSwapRequest = () => {
    // Navigate to the "/course-swap" route
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
        Edit your deals
      </Link>
    </li>
  </>
  
  );

  return (
    <header
      className={`max-w-screen-2xl container mx-auto fixed top-0 left-0 right-0 transition-all duration-300 ease-in-out`}
    >
      <div
        className={`navbar xl:px-24 ${
          isSticky
            ? "shadow-md bg-base-100 transition-all duration-300 ease-in-out"
            : ""
        }`}
      >
        <div className="navbar-start">
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
        <div className="navbar-end">
        
        

          {user ? (
            <>
              <button
                onClick={handleCreateSwapRequest}
                className="btn btn-primary"
              >
                Create Swap Request
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
