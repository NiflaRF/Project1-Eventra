import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faBuilding, faCalendar, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import '../styles/Features.css';

const Features = () => {
  const features = [
    {
      icon: faLock,
      title: 'Secure Role-Based Login',
      description: 'Access the platform securely with role-specific permissions and features.'
    },
    {
      icon: faBuilding,
      title: 'Venue Search & Booking',
      description: 'Find and book available campus spaces with ease.'
    },
    {
      icon: faCalendar,
      title: 'Calendar Integration',
      description: 'Seamlessly integrate with your calendar for event management.'
    },
    {
      icon: faClipboardList,
      title: 'Event Request & Approval',
      description: 'Streamlined workflow for event requests and approvals.'
    }
  ];

  return (
    <section id="features" className="features py-5">
      <div className="container">
        <h2 className="text-center mb-5">Features</h2>
        <div className="row">
          {features.map((feature, index) => (
            <div key={index} className="col-md-3 mb-4">
              <div className="feature-card text-center">
                <div className="icon-wrapper">
                  <FontAwesomeIcon icon={feature.icon} size="2x" />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
