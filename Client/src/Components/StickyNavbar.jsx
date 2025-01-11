import React, { useState, useEffect, useRef,useContext } from "react";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Collapse,
} from "@material-tailwind/react";
import { NavLink, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth"; 
import { FaUserCircle } from 'react-icons/fa';
import { gsap } from "gsap"; // Correct GSAP import
import 'animate.css/animate.min.css'; // Correct Animate.css import
import { UserContext } from "../Context/UserContext";
import { MdMuseum } from "react-icons/md";

export function StickyNavbar() {  
  const [openNav, setOpenNav] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false); 

  const auth = getAuth(); 
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user); 
      
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    window.addEventListener("resize", () => window.innerWidth >= 960 && setOpenNav(false));
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      ".logo",
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 2, ease: "bounce.out" }
    );

    gsap.fromTo(
      ".nav-item",
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
    );
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null); 
    }).catch((error) => {
      console.error("Logout error:", error);
    });
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleProfileClick = () => {
    navigate("/profile"); 
  };

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6 animate__animated animate__fadeInDown">
      <NavLink  to="/" className={({ isActive }) => (isActive ? 'p-1  font-bold  text-blue-900 dark:text-gray-300 text-[15px] hover:text-blue-600 dark:hover:text-blue-400 nav-item' : 'p-1 font-normal dark:text-gray-300 text-[15px] hover:text-blue-600 dark:hover:text-blue-400 nav-item')}>
          Home
      </NavLink>
      <NavLink to="/aboutus" className={({ isActive }) => (isActive ? 'p-1 font-bold  text-blue-900 dark:text-gray-300 text-[15px] hover:text-blue-600 dark:hover:text-blue-400 nav-item' : 'p-1 font-normal dark:text-gray-300 text-[15px] hover:text-blue-600 dark:hover:text-blue-400 nav-item')}>
          AboutUs
      </NavLink>
      <NavLink to="/shop" className={({ isActive }) => (isActive ? 'p-1 font-bold  text-blue-900 dark:text-gray-300 text-[15px] hover:text-blue-600 dark:hover:text-blue-400 nav-item' : 'p-1 font-normal dark:text-gray-300 text-[15px] hover:text-blue-600 dark:hover:text-blue-400 nav-item')}>
          Shop
      </NavLink>
      <NavLink to="/history" className={({ isActive }) => (isActive ? 'p-1 font-bold  text-blue-900 dark:text-gray-300 text-[15px] hover:text-blue-600 dark:hover:text-blue-400 nav-item' : 'p-1 font-normal dark:text-gray-300 text-[15px] hover:text-blue-600 dark:hover:text-blue-400 nav-item')}>
          Booking History
      </NavLink>
      <NavLink to="/vt" className={({ isActive }) => (isActive ? 'p-1 font-bold  text-blue-900 dark:text-gray-300 text-[15px] hover:text-blue-600 dark:hover:text-blue-400 nav-item' : 'p-1 font-normal dark:text-gray-300 text-[15px] hover:text-blue-600 dark:hover:text-blue-400 nav-item')}>
          Virtual Tour
      </NavLink>
     
      
      
    </ul>
  );

  const renderAuthButtons = () => {
    if (user) {
      return (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleProfileClick}
            className="flex items-center gap-2 text-[16px] dark:text-gray-300 nav-item"
          >
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <FaUserCircle className="h-8 w-8 text-gray-500 dark:text-gray-300" />
            )}
            {user.displayName || "Profile"}
          </button>
        </div>
      );
    }

    return (
      <>
        <NavLink to="/login">
          <Button variant="text" size="sm" className="text-[14px] dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 animate__animated animate__fadeInLeft">
            Log In
          </Button>
        </NavLink>
        <NavLink to="/signup">
          <Button variant="gradient" size="sm" className="text-[12px] bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-purple-500 hover:to-pink-500 animate__animated animate__fadeInRight">
            Sign Up
          </Button>
        </NavLink>
      </>
    );
  };

  return (
    <div className={`max-h-[768px] w-[100%] ${darkMode ? "dark" : "light"}`}>
      <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4 bg-white/80 backdrop-blur-md dark:bg-gray-800 shadow-lg animate__animated animate__fadeInDown">
        <div className="flex items-center justify-between text-blue-gray-900 dark:text-white">
        <MdMuseum className="text-6xl h-[60px] p-0 rounded-full animate__animated animate__bounceIn"/>
          <span className="drop-shadow-xl font-fjalla text-black-600 main-title font-bold lg:text-5xl text-2xl dark:text-white">Nehru Science Centre</span>
          <div className="flex items-center gap-4">
            <div className="mr-4 hidden lg:block">{navList}</div>
            <div className="hidden lg:flex items-center gap-x-1">
              {renderAuthButtons()}
            </div>
            <IconButton
              variant="text"
              className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
              ripple={false}
              onClick={() => setOpenNav(!openNav)}
            >
              {openNav ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </IconButton>
          </div>
        </div>
        <Collapse open={openNav}>
          {navList}
        
        </Collapse>
      </Navbar>
    </div>
  );
}

export default StickyNavbar;