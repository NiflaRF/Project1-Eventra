import React from 'react';
import { Link } from 'react-scroll';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h4>Quick Links</h4>
            <ul className="list-unstyled">
              <li>
                <Link to="home" smooth={true} duration={500}>
                  Login / Register
                </Link>
              </li>
              <li>
                <Link to="about" smooth={true} duration={500}>
                  About
                </Link>
              </li>
              <li>
                <Link to="contact" smooth={true} duration={500}>
                  Help & Support
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <div className="text-center">
              <img src="/university-logo.png" alt="University Logo" className="university-logo" />
            </div>
          </div>
          <div className="col-md-4">
            <p className="text-end copyright">
              © 2025 Eventra, Your University Name. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
