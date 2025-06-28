import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faSearch, faFileAlt, faCheckCircle, faStar } from '@fortawesome/free-solid-svg-icons';
import '../styles/HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    {
      icon: faUserPlus,
      title: 'Register & Login',
      description: 'Create your account and sign in securely'
    },
    {
      icon: faSearch,
      title: 'Search Available Venues',
      description: 'Browse and find the perfect space'
    },
    {
      icon: faFileAlt,
      title: 'Submit Event Request',
      description: 'Fill in event details and requirements'
    },
    {
      icon: faCheckCircle,
      title: 'Get Approvals',
      description: 'Wait for confirmation from authorities'
    },
    {
      icon: faStar,
      title: 'Host Your Event',
      description: 'Successfully execute your event'
    }
  ];

  return (
    <section id="how-it-works" className="how-it-works py-5">
      <div className="container">
        <h2 className="text-center mb-5">How It Works</h2>
        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={index} className="step">
              <div className="step-number">{index + 1}</div>
              <div className="step-icon">
                <FontAwesomeIcon icon={step.icon} />
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              {index < steps.length - 1 && <div className="step-connector"></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
