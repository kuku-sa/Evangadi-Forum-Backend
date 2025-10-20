import React from "react";
import { useNavigate } from "react-router-dom";
import "./HowItWorks.css";

const HowItWorks = () => {
  const navigate = useNavigate();

  return (
    <div className="how-it-works-container">
      <div className="how-it-works-header">
        <h1 className="how-heading">How It Works</h1>
        <p className="how-subtitle">
          Learn how Evangadi Networks connects mentors and mentees.
        </p>
      </div>

      <div className="how-content">
        <section className="how-section">
          <h2>Evangadi Networks</h2>
          <p>
            No matter what stage of life you are in, whether you're just
            starting elementary school or being promoted to CEO of a Fortune 500
            company, you have much to offer to those who are trying to follow in
            your footsteps.
          </p>
          <p>
            Whether you are willing to share your knowledge or you are just
            looking to meet mentors of your own, please start by joining the
            network here.
          </p>
        </section>

        <section className="how-steps">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Create Your Account</h3>
            <p>
              Sign up with your email and create a profile to join our
              community.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Ask Questions</h3>
            <p>
              Post questions and get answers from experienced community members.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Share Knowledge</h3>
            <p>Answer questions and help others grow with your expertise.</p>
          </div>

          <div className="step-card">
            <div className="step-number">4</div>
            <h3>Build Connections</h3>
            <p>Connect with mentors and mentees to grow together.</p>
          </div>
        </section>

        <div className="how-cta">
          <button
            className="cta-button-secondary"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
