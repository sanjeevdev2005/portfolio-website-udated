import { useEffect, useState } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import heroImage from "../assets/image.png";
import API from "../api";

function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/api/projects`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        return response.json();
      })
      .then((data) => {
        const featuredProjects = data.filter(
          (project) => project.featured === true,
        );

        setProjects(featuredProjects);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
        setError("Could not load projects. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <p className="eyebrow">DEVELOPER PORTFOLIO</p>

          <h1>Hi, I'm Sanjeev.</h1>

          <p className="intro">
            I build projects to learn, solve problems, and turn ideas into
            working applications.
          </p>

          <div className="hero-buttons">
            <a href="/work" className="primary-button">
              View Projects ↗
            </a>

            <a href="/resume" className="secondary-button">
              View Resume ↗
            </a>
          </div>
        </div>

        <div className="hero-image">
          <img
            src={heroImage}
            
          />
        </div>
      </header>

      {/* Featured Projects Section */}
      <main>
        <section className="projects-section" id="projects">
          <div className="section-heading">
            <p className="eyebrow">MY WORK</p>

            <h2>Featured Projects</h2>

            <p>Here are some things I've been building.</p>
          </div>

          {loading && <p className="status">Loading projects...</p>}

          {error && <p className="status error">{error}</p>}

          {!loading && !error && projects.length === 0 && (
            <p className="status">
              No projects found yet.
            </p>
          )}

          <div className="projects-grid">
            {projects.map((project) => (
              <article className="project-card" key={project._id}>
                {project.imageUrl && (
                  <img
                    className="project-image"
                    src={project.imageUrl}
                    alt={project.title}
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                )}

                <div className="project-content">
                  <h3>{project.title}</h3>

                  <p className="project-description">{project.description}</p>

                  <div className="tech-stack">
                    {project.techstack?.map((technology, index) => (
                      <span key={`${technology}-${index}`}>{technology}</span>
                    ))}
                  </div>

                  <div className="project-links">
                    {project.githubURL && (
                      <a
                        href={project.githubURL}
                        target="_blank"
                        rel="noreferrer"
                      >
                        GitHub ↗
                      </a>
                    )}

                    {project.liveURL && (
                      <a
                        href={project.liveURL}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Live Demo ↗
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="view-all">
            <Link to="/work">View All Projects ↗</Link>
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;
