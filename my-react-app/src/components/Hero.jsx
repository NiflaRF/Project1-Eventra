import React from 'react';
import { Link } from 'react-scroll';
import '../styles/Hero.css';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="hero-overlay"></div>
      <div className="container">
        <div className="hero-content text-center">
          <h1 className="display-4 mb-4 fade-in">
            Reserve Campus Spaces Effortlessly with Eventra!
          </h1>
          <div className="hero-buttons">
            <Link
              to="register"
              smooth={true}
              duration={500}
              className="btn btn-primary btn-lg me-3"
            >
              Get Started
            </Link>
            <Link
              to="features"
              smooth={true}
              duration={500}
              className="btn btn-outline-light btn-lg"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
