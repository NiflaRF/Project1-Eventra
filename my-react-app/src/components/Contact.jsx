import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import '../styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <section id="contact" className="contact py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h2 className="mb-4">Contact Us</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea
                  className="form-control"
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Send Message</button>
            </form>
          </div>
          <div className="col-md-6">
            <div className="contact-info">
              <h3>University Helpdesk</h3>
              <p>Need immediate assistance? Contact our helpdesk:</p>
              <ul className="list-unstyled">
                <li>📞 Phone: (555) 123-4567</li>
                <li>📧 Email: helpdesk@university.edu</li>
                <li>🏢 Location: Student Center, Room 101</li>
              </ul>
              <div className="social-links">
                <a href="#" className="me-3"><FontAwesomeIcon icon={faFacebook} size="2x" /></a>
                <a href="#" className="me-3"><FontAwesomeIcon icon={faTwitter} size="2x" /></a>
                <a href="#" className="me-3"><FontAwesomeIcon icon={faLinkedin} size="2x" /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
