import { useEffect, useState } from "react";
import "./Resume.css";

import API from "../api";

function Resume() {
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchResume() {
            try {
                const response = await fetch(`${API}/api/resume`);

                if (!response.ok) {
                    throw new Error("Could not load resume");
                }

                const data = await response.json();
                setResume(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchResume();
    }, []);

    if (loading) return <p>Loading resume...</p>;

    if (error) return <p>{error}</p>;

    if (!resume) return <p>No resume is available right now.</p>;

    return (
        <main className="resume-page">
            <div className="resume-header">
                <div>
                    <h1>My Resume</h1>
                    <p>View or download my latest resume.</p>
                </div>

                <a
                    href={resume.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                >
                    Download Resume
                </a>
            </div>

            <iframe
                src={resume.fileUrl}
                title="My Resume"
                width="100%"
                height="800px"
            />
        </main>
    );
}

export default Resume;