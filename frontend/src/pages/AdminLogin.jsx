
import { useState } from "react";
import "./AdminLogin.css";
import API from "../api";

function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(event) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                `${API}/api/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            alert("Login successful!");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="admin-login-page">
            <form className="login-card" onSubmit={handleLogin}>
                <p className="login-eyebrow">ADMIN ACCESS</p>

                <h1>Welcome back.</h1>

                <p className="login-description">
                    Sign in to manage your portfolio.
                </p>

                <div className="login-field">
                    <label htmlFor="email">Email address</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <div className="login-field">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        placeholder="Enter your password"
                        required
                    />
                </div>

                {error && (
                    <p className="login-error">{error}</p>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                </button>

                <p className="login-footer">
                    Private access for the portfolio administrator.
                </p>
            </form>
        </main>
    );
}

export default AdminLogin;
