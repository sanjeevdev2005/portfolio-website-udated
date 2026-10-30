
import "./Navbar.css";
import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [showContact, setShowContact] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [copied, setCopied] = useState(false);

  const email = "sanjeevkumargupta20005@gmail.com";

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch (error) {
      console.error("Could not copy email:", error);
    }
  }

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        SK<span>.</span>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/work">Work</Link>
        <Link to="/about">About</Link>
        <Link to="/resume">Resume</Link>
      </div>

      <div className="contact-container">
        <button
          className="contact-link"
          onClick={() => {
            setShowContact(!showContact);
            setShowEmail(false);
          }}
        >
          Get in touch ↗
        </button>

        {showContact && (
          <div className="contact-popup">
            <button onClick={() => setShowEmail(!showEmail)}>
              <span>Email</span>
              <span>↗</span>
            </button>

            <a
              href="https://github.com/sanjeevdev2005?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>GitHub</span>
              <span>↗</span>
            </a>

            <a
              href="https://www.linkedin.com/in/sanjeevdev2005/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>LinkedIn</span>
              <span>↗</span>
            </a>

            <a
              href="https://x.com/Sanjeevcode2005"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>X</span>
              <span>↗</span>
            </a>

            {showEmail && (
              <div className="email-popup">
                <p>Email me at</p>

                <div className="email-address">{email}</div>

                <button className="copy-button" onClick={copyEmail}>
                  {copied ? "Copied!" : "Copy email"}
                </button>

                <a
                  className="gmail-link"
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Gmail ↗
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
