import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../css/login.css';
import { ExceptionHandler } from "../javascript/Exceptions/ExceptionHandler";

function LoginView() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const API_REFRESH_TOKEN = process.env.REACT_APP_REFRESH_TOKEN;
    const API_LOGIN = process.env.REACT_APP_LOGIN;
    const API_DATA = process.env.REACT_APP_USER_DATA;

    useEffect(() => {
        const autoLogin = async () => {
            try {
                const res = await fetch(API_REFRESH_TOKEN, {
                    method: "POST",
                    credentials: "include"
                });

                if (!res.ok) {
                    setLoading(false);
                    return;
                }

                const data = await res.json();
                sessionStorage.setItem("accessToken", data.accessToken);

                const userRes = await fetch(API_DATA, {
                    headers: { Authorization: `Bearer ${data.accessToken}` },
                    credentials: "include",
                });

                if (!userRes.ok || userRes.status === 403) {
                    setError("Seanca juaj ka skaduar. Ju lutemi kyçuni përsëri.");
                    setLoading(false);
                    return;
                }

                const userInfo = await userRes.json();
                sessionStorage.setItem("userDetails", JSON.stringify(userInfo));
                navigate("/home");
            } catch (err) {
                // ExceptionHandler.handle(err);
                setError("Nuk mund të lidhej me serverin.");
                setLoading(false);
            }
        };

        autoLogin();
    }, [navigate, API_REFRESH_TOKEN, API_DATA]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            const response = await fetch(API_LOGIN, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
                credentials: "include",
            });

            if (response.status === 401) {
                setError("Përdoruesi ose fjalëkalimi është i pasaktë!");
                setSubmitting(false);
                return;
            }

            if (!response.ok) {
                setError("Kyçja dështoi. Ju lutemi provoni përsëri më vonë.");
                setSubmitting(false);
                return;
            }

            const data = await response.json();
            sessionStorage.setItem("accessToken", data.token);

            const userRes = await fetch(API_DATA, {
                headers: { Authorization: `Bearer ${data.token}` },
                credentials: "include",
            });

            if (!userRes.ok) {
                setError("Dështoi marrja e të dhënave të përdoruesit!");
                setSubmitting(false);
                return;
            }

            const userInfo = await userRes.json();
            sessionStorage.setItem("userDetails", JSON.stringify(userInfo));

            navigate("/home");
        } catch (err) {
            // ExceptionHandler.handle(err);
            setError("Nuk mund të arrihej serveri!");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="login-wrapper">
                <div className="loader-container">
                    <div className="spinner"></div>
                    <p>Po verifikohet seanca...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <div className="login-header">
                    <h2>Mirë se vini</h2>
                    <p>Vendosni të dhënat tuaja për t'u kyçur</p>
                </div>

                {error && (
                    <div className="error-banner" role="alert">
                        <svg viewBox="0 0 24 24" className="error-icon">
                            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="username">Emri i përdoruesit</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Shkruani emrin e përdoruesit"
                            autoComplete="username"
                            disabled={submitting}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Fjalëkalimi</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Shkruani fjalëkalimin"
                                autoComplete="current-password"
                                disabled={submitting}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex="-1"
                                aria-label={showPassword ? "Fshih fjalëkalimin" : "Shfaq fjalëkalimin"}
                            >
                                {showPassword ? (
                                    <svg viewBox="0 0 24 24" width="20" height="20">
                                        <path fill="currentColor" d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.44-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.17c0-1.66-1.34-3-3-3l-.17.02z"/>
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" width="20" height="20">
                                        <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="login-btn" disabled={submitting}>
                        {submitting ? <span className="btn-spinner"></span> : "Kyçuni"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginView;