import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

import API from "../api";

const initialForm = {
    title: "",
    description: "",
    techstack: "",
    imageUrl: "",
    githubURL: "",
    liveURL: "",
    blogURL: "",
    youtubeURL: "",
    featured: false,
};

function AdminDashboard() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState("projects");

    // Project states
    const [projects, setProjects] = useState([]);
    const [projectsLoading, setProjectsLoading] = useState(false);
    const [projectsError, setProjectsError] = useState("");

    const [form, setForm] = useState(initialForm);
    const [showForm, setShowForm] = useState(false);
    const [editingProjectId, setEditingProjectId] = useState(null);
    const [saving, setSaving] = useState(false);

    // Resume states
    const [resume, setResume] = useState(null);
    const [resumeLoading, setResumeLoading] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeSaving, setResumeSaving] = useState(false);
    const [resumeMessage, setResumeMessage] = useState("");
    const [resumeError, setResumeError] = useState("");

    // General messages
    const [message, setMessage] = useState("");

    // Check authentication
    useEffect(() => {
        async function checkAuthentication() {
            try {
                const response = await fetch(
                    `${API}/api/auth/check`,
                    { credentials: "include" }
                );

                if (!response.ok) {
                    navigate("/admin");
                    return;
                }

                setLoading(false);
            } catch (error) {
                console.error(error);
                navigate("/admin");
            }
        }

        checkAuthentication();
    }, [navigate]);

    // Fetch projects
    async function fetchProjects() {
        setProjectsLoading(true);
        setProjectsError("");

        try {
            const response = await fetch(`${API}/api/projects`);

            if (!response.ok) {
                throw new Error("Could not load projects");
            }

            const data = await response.json();
            setProjects(data);
        } catch (error) {
            setProjectsError(error.message);
        } finally {
            setProjectsLoading(false);
        }
    }

    // Fetch resume
    async function fetchResume() {
        setResumeLoading(true);
        setResumeError("");

        try {
            const response = await fetch(`${API}/api/resume`);

            if (!response.ok) {
                throw new Error("Could not load resume");
            }

            const data = await response.json();
            setResume(data);
        } catch (error) {
            setResumeError(error.message);
        } finally {
            setResumeLoading(false);
        }
    }

    // Load dashboard data after authentication
    useEffect(() => {
        if (!loading) {
            fetchProjects();
            fetchResume();
        }
    }, [loading]);

    // Handle project form changes
    function handleChange(event) {
        const { name, value, type, checked } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    // Open form for adding a project
    function openAddForm() {
        setForm(initialForm);
        setEditingProjectId(null);
        setShowForm(true);
        setMessage("");
        setProjectsError("");
    }

    // Open form for editing a project
    function openEditForm(project) {
        setForm({
            title: project.title || "",
            description: project.description || "",
            techstack: (project.techstack || []).join(", "),
            imageUrl: project.imageUrl || "",
            githubURL: project.githubURL || "",
            liveURL: project.liveURL || "",
            blogURL: project.blogURL || "",
            youtubeURL: project.youtubeURL || "",
            featured: project.featured || false,
        });

        setEditingProjectId(project._id);
        setShowForm(true);
        setMessage("");
        setProjectsError("");
        setActiveSection("projects");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    // Add or update project
    async function handleSaveProject(event) {
        event.preventDefault();

        setSaving(true);
        setProjectsError("");
        setMessage("");

        const projectData = {
            ...form,
            techstack: form.techstack
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
        };

        const isEditing = Boolean(editingProjectId);

        try {
            const response = await fetch(
                isEditing
                    ? `${API}/api/projects/${editingProjectId}`
                    : `${API}/api/projects`,
                {
                    method: isEditing ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(projectData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Could not save project"
                );
            }

            setForm(initialForm);
            setEditingProjectId(null);
            setShowForm(false);

            setMessage(
                isEditing
                    ? "Project updated successfully!"
                    : "Project added successfully!"
            );

            await fetchProjects();
        } catch (error) {
            setProjectsError(error.message);
        } finally {
            setSaving(false);
        }
    }

    // Delete project
    async function handleDeleteProject(projectId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this project?"
        );

        if (!confirmed) return;

        try {
            const response = await fetch(
                `${API}/api/projects/${projectId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Could not delete project"
                );
            }

            setMessage("Project deleted successfully!");
            await fetchProjects();
        } catch (error) {
            setProjectsError(error.message);
        }
    }

    // Upload or replace resume
    async function handleResumeUpload(event) {
        event.preventDefault();

        if (!resumeFile) {
            setResumeError("Please select a PDF file first.");
            return;
        }

        if (resumeFile.type !== "application/pdf") {
            setResumeError("Only PDF files are allowed.");
            return;
        }

        if (resumeFile.size > 5 * 1024 * 1024) {
            setResumeError("The PDF must be smaller than 5 MB.");
            return;
        }

        setResumeSaving(true);
        setResumeError("");
        setResumeMessage("");

        const formData = new FormData();
        formData.append("resume", resumeFile);

        try {
            const response = await fetch(`${API}/api/resume`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Resume upload failed"
                );
            }

            setResumeFile(null);
            event.target.reset();

            setResumeMessage(
                resume
                    ? "Resume replaced successfully!"
                    : "Resume uploaded successfully!"
            );

            await fetchResume();
        } catch (error) {
            setResumeError(error.message);
        } finally {
            setResumeSaving(false);
        }
    }

    // Delete resume
    async function handleDeleteResume() {
        const confirmed = window.confirm(
            "Are you sure you want to delete your resume?"
        );

        if (!confirmed) return;

        setResumeError("");
        setResumeMessage("");

        try {
            const response = await fetch(`${API}/api/resume`, {
                method: "DELETE",
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Could not delete resume"
                );
            }

            setResumeMessage("Resume deleted successfully!");
            setResume(null);
        } catch (error) {
            setResumeError(error.message);
        }
    }

    // Logout
    async function handleLogout() {
        try {
            const response = await fetch(`${API}/api/auth/logout`, {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Logout failed");
            }

            navigate("/admin");
        } catch (error) {
            console.error("Logout error:", error);
        }
    }

    if (loading) {
        return <p>Checking authentication...</p>;
    }

    return (
        <main className="admin-dashboard">

            {/* Sidebar */}
            <aside className="admin-sidebar">
                <h2>Admin Panel</h2>

                <button
                    className={activeSection === "projects" ? "active" : ""}
                    onClick={() => setActiveSection("projects")}
                >
                    Projects
                </button>

                <button
                    className={activeSection === "resume" ? "active" : ""}
                    onClick={() => setActiveSection("resume")}
                >
                    Resume
                </button>

                <button
                    className={activeSection === "homepage" ? "active" : ""}
                    onClick={() => setActiveSection("homepage")}
                >
                    Homepage
                </button>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </aside>

            {/* Main dashboard */}
            <section className="admin-content">

                {/* PROJECTS */}
                {activeSection === "projects" && (
                    <div>
                        <div className="admin-section-header">
                            <div>
                                <h1>Manage Projects</h1>
                                <p>Add, edit, and manage your portfolio projects.</p>
                            </div>

                            <button onClick={openAddForm}>
                                + Add Project
                            </button>
                        </div>

                        {message && <p className="admin-success">{message}</p>}

                        {projectsError && (
                            <p className="admin-error">{projectsError}</p>
                        )}

                        {showForm && (
                            <form
                                className="project-form"
                                onSubmit={handleSaveProject}
                            >
                                <h2>
                                    {editingProjectId
                                        ? "Edit Project"
                                        : "Add New Project"}
                                </h2>

                                <label>Project Title</label>
                                <input
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    required
                                />

                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    required
                                />

                                <label>Technologies (comma separated)</label>
                                <input
                                    name="techstack"
                                    value={form.techstack}
                                    onChange={handleChange}
                                    placeholder="React, Node.js, MongoDB"
                                    required
                                />

                                <label>Image URL</label>
                                <input
                                    type="url"
                                    name="imageUrl"
                                    value={form.imageUrl}
                                    onChange={handleChange}
                                />

                                <label>GitHub URL</label>
                                <input
                                    type="url"
                                    name="githubURL"
                                    value={form.githubURL}
                                    onChange={handleChange}
                                />

                                <label>Live Demo URL</label>
                                <input
                                    type="url"
                                    name="liveURL"
                                    value={form.liveURL}
                                    onChange={handleChange}
                                />

                                <label>Blog URL</label>
                                <input
                                    type="url"
                                    name="blogURL"
                                    value={form.blogURL}
                                    onChange={handleChange}
                                />

                                <label>YouTube URL</label>
                                <input
                                    type="url"
                                    name="youtubeURL"
                                    value={form.youtubeURL}
                                    onChange={handleChange}
                                />

                                <label className="featured-checkbox">
                                    <input
                                        type="checkbox"
                                        name="featured"
                                        checked={form.featured}
                                        onChange={handleChange}
                                    />
                                    Show as featured project
                                </label>

                                <div className="form-actions">
                                    <button type="submit" disabled={saving}>
                                        {saving
                                            ? "Saving..."
                                            : editingProjectId
                                            ? "Update Project"
                                            : "Save Project"}
                                    </button>

                                    <button
                                        type="button"
                                        className="cancel-button"
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditingProjectId(null);
                                            setForm(initialForm);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}

                        {projectsLoading && <p>Loading projects...</p>}

                        {!projectsLoading && projects.length === 0 && (
                            <p>No projects found.</p>
                        )}

                        <div className="admin-project-list">
                            {projects.map((project) => (
                                <article
                                    key={project._id}
                                    className="admin-project-item"
                                >
                                    <div>
                                        <h3>{project.title}</h3>
                                        <p>{project.description}</p>

                                        <span>
                                            {project.featured
                                                ? "Featured"
                                                : "Not featured"}
                                        </span>
                                    </div>

                                    <div className="project-admin-actions">
                                        <button
                                            onClick={() =>
                                                openEditForm(project)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="delete-project-button"
                                            onClick={() =>
                                                handleDeleteProject(
                                                    project._id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                )}

                {/* RESUME */}
                {activeSection === "resume" && (
                    <div>
                        <h1>Manage Resume</h1>
                        <p>Upload or replace the PDF displayed on your website.</p>

                        {resumeMessage && (
                            <p className="admin-success">{resumeMessage}</p>
                        )}

                        {resumeError && (
                            <p className="admin-error">{resumeError}</p>
                        )}

                        {resumeLoading ? (
                            <p>Loading resume...</p>
                        ) : (
                            <div className="resume-admin-card">
                                <h2>Current Resume</h2>

                                {resume ? (
                                    <div>
                                        <p>
                                            <strong>File:</strong>{" "}
                                            {resume.fileName}
                                        </p>

                                        <a
                                            href={resume.fileUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            View current resume
                                        </a>

                                        <div className="resume-admin-actions">
                                            <a
                                                href={resume.fileUrl}
                                                download
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Download PDF
                                            </a>

                                            <button
                                                className="delete-project-button"
                                                onClick={handleDeleteResume}
                                            >
                                                Delete Resume
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <p>No resume uploaded yet.</p>
                                )}
                            </div>
                        )}

                        <form
                            className="resume-upload-form"
                            onSubmit={handleResumeUpload}
                        >
                            <h2>
                                {resume
                                    ? "Replace Resume"
                                    : "Upload Resume"}
                            </h2>

                            <label>Select PDF file</label>

                            <input
                                type="file"
                                accept="application/pdf,.pdf"
                                onChange={(event) =>
                                    setResumeFile(event.target.files[0] || null)
                                }
                            />

                            {resumeFile && (
                                <p>
                                    Selected: {resumeFile.name}
                                </p>
                            )}

                            <p className="upload-hint">
                                PDF only. Maximum file size: 5 MB.
                            </p>

                            <button
                                type="submit"
                                disabled={resumeSaving || !resumeFile}
                            >
                                {resumeSaving
                                    ? "Uploading..."
                                    : resume
                                    ? "Replace Resume"
                                    : "Upload Resume"}
                            </button>
                        </form>
                    </div>
                )}

                {/* HOMEPAGE */}
                {activeSection === "homepage" && (
                    <div>
                        <h1>Homepage Settings</h1>
                        <p>
                            Homepage content editing will be added after
                            project and resume management are tested.
                        </p>
                    </div>
                )}
            </section>
        </main>
    );
}

export default AdminDashboard;