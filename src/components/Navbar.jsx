import React, { useEffect, useState, useRef } from "react";
import logo from "/logo.png";
import { FaRegUser } from "react-icons/fa";
import Modal from "./Modal";
import Profile from "./Profile";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const [isSticky, setSticky] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [isScreenShrunk, setIsScreenShrunk] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 0);
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    const handleResize = () => {
      setIsScreenShrunk(window.innerWidth <= 768);
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    handleScroll();
    handleResize();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const closeDropdown = () => setIsDropdownOpen(false);

  const handleCreateSwapRequest = () => {
    navigate("/course-swap");
    closeDropdown();
  };

  const navItems = (
    <>
      <li>
        <Link to="/" className={`text-thewhite ${isSticky ? 'font-bold' : 'font-bold'}`} onClick={closeDropdown}>
          Home
        </Link>
      </li>
      <li>
        <Link to="/swaptable" className={`text-thewhite ${isSticky ? 'font-bold' : 'font-bold'}`} onClick={closeDropdown}>
          Available Deals
        </Link>
      </li>
      {user ? (
        <li>
          <Link to={`/swap/${user}`} className={`text-thewhite ${isSticky ? 'font-bold' : 'font-bold'}`} onClick={closeDropdown}>
            My Deals
          </Link>
        </li>
      ) : null}
    </>
  );

  return (
    <header className={`max-w-screen-2xl container mx-auto fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out bg-purple-900`}>
      <div
        className="navbar"
        style={{ transition: 'background-color 0.3s, box-shadow 0.3s' }}
      >
        <div className="navbar-start pl-5">
          <div className="dropdown" ref={dropdownRef} bg-black>
            <label tabIndex={0} className="btn btn-ghost lg:hidden" onClick={toggleDropdown}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-8 6h8"/>
              </svg>
            </label>
            <ul
              tabIndex={0}
              className={`menu menu-sm dropdown-content mt-3 p-2 shadow bg-gray-800 rounded-box w-52 ${isDropdownOpen ? 'block' : 'hidden'}`}
            >
              {navItems}
            </ul>
          </div>
          <Link to="/">
            <img src={logo} alt="logo" className="h-8" />
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal p-0">
            {navItems}
          </ul>
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
                  backgroundColor: isScreenShrunk ? 'black' : '#000000',
                }}
              >
                {isScreenShrunk ? 'Create' : 'Create New Deal'}
              </button>
              <Profile user={user} />
            </>
          ) : (
            <button
              onClick={() => document.getElementById('my_modal_5').showModal()}
              className="btn flex items-center gap-2 rounded-full bg-green text-white"
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
