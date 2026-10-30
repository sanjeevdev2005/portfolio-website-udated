
import { useEffect, useState } from "react";
import "./Work.css";
import API from "../api";

function Work() {
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
        setProjects(data);
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
    <main className="work-page">

      {/* Page Heading */}
      <header className="work-header">
        <p className="eyebrow">MY WORK</p>

        <h1>Projects & Experiments</h1>

        <p>
          A collection of projects I've built while learning,
          experimenting, and solving problems.
        </p>
      </header>

      {/* Projects Section */}
      <section className="work-projects">

        {loading && (
          <p className="status">Loading projects...</p>
        )}

        {error && (
          <p className="status error">{error}</p>
        )}

        {!loading && !error && projects.length === 0 && (
          <p className="status">
            No projects available yet.
          </p>
        )}

        <div className="projects-grid">

          {projects.map((project) => (

            <article className="project-card" key={project._id}>

              {/* Clicking the project content opens its blog article */}
              <a
                className="project-main-link"
                href={project.blogURL || undefined}
                target={project.blogURL ? "_blank" : undefined}
                rel={project.blogURL ? "noreferrer" : undefined}
                onClick={!project.blogURL ? (event) => event.preventDefault() : undefined}
              >

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

                  <p className="project-description">
                    {project.description}
                  </p>

                  <div className="tech-stack">
                    {project.techstack?.map((technology, index) => (
                      <span key={`${technology}-${index}`}>
                        {technology}
                      </span>
                    ))}
                  </div>

                </div>

              </a>

              {/* Project Links */}
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

                {project.blogURL && (
                  <a
                    href={project.blogURL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Blog ↗
                  </a>
                )}

                {project.youtubeURL && (
                  <a
                    href={project.youtubeURL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    YouTube ↗
                  </a>
                )}

              </div>

            </article>

          ))}

        </div>
      </section>

    </main>
  );
}

export default Work;