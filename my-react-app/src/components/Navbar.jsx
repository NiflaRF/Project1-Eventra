import React, { useState } from 'react';
import { Link } from 'react-scroll';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container">
        <Link to="home" className="navbar-brand" smooth={true} duration={500}>
          Eventra
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-expanded={isOpen}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="home" className="nav-link" smooth={true} duration={500}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="about" className="nav-link" smooth={true} duration={500}>
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link to="features" className="nav-link" smooth={true} duration={500}>
                Features
              </Link>
            </li>
            <li className="nav-item">
              <Link to="contact" className="nav-link" smooth={true} duration={500}>
                Contact Us
              </Link>
            </li>
          </ul>
          <div className="d-flex">
            <button className="btn btn-outline-primary me-2">Login</button>
            <button className="btn btn-primary">Register</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
