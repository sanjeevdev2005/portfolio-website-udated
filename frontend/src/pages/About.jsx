
import "./About.css";

function About() {
  return (
    <main className="about-page">

      {/* Introduction */}
      <section className="about-intro">
        <p className="eyebrow">ABOUT ME</p>

        <h1>A little about me.</h1>

        <p>
          I'm Sanjeev, a Computer Science student interested
          in software engineering, machine learning, and
          building useful applications.
        </p>

        <a href="/resume" className="about-resume-button">
          View My Resume ↗
        </a>
      </section>

      {/* Education */}
      <section className="about-section">
        <h2>Education</h2>

        <div className="education-card">
          <h3>Bachelor of Technology — Computer Science</h3>

          <span>Expected Graduation: 2029</span>
        </div>
      </section>

      {/* Skills */}
      <section className="about-section">
        <h2>Skills & Technologies</h2>

        <div className="skills-list">
          <div>
            <h3>Programming</h3>
            <p>C++, JavaScript, Python</p>
          </div>

          <div>
            <h3>Web Development</h3>
            <p>HTML, CSS, React, Node.js, Express, MongoDB</p>
          </div>

          <div>
            <h3>Machine Learning</h3>
            <p>Python, scikit-learn</p>
          </div>

          <div>
            <h3>Tools</h3>
            <p>Git, GitHub, VS Code</p>
          </div>
        </div>
      </section>

      {/* Connect */}
      <section className="about-section">
        <h2>Let's Connect</h2>

        <p>
          Interested in collaborating, discussing technology,
          or working on interesting projects?
        </p>

        <a href="mailto:sanjeevkumargupta20005@gmail.com">
          Send me an email ↗
        </a>
      </section>

    </main>
  );
}

export default About;
