import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../css/login.css';
import { ExceptionHandler } from "../javascript/Exceptions/ExceptionHandler";

function LoginView() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(""); // track auto-login attempt // track backend errors
    const navigate = useNavigate();

       const API_REFRESH_TOKEN = process.env.REACT_APP_REFRESH_TOKEN;
       const API_LOGIN = process.env.REACT_APP_LOGIN;
       const API_DATA = process.env.REACT_APP_USER_DATA;

    useEffect(() => {
        const autoLogin = async () => {
            try {
                const res = await fetch(
                    API_REFRESH_TOKEN,
                    { method: "POST", credentials: "include" }
                );

                if (!res.ok) {
                    setLoading(false);  // show form
                    return;
                }

                const data = await res.json();
                sessionStorage.setItem("accessToken", data.accessToken);

                const userRes = await fetch(
                    API_DATA,
                    {
                        headers: { Authorization: `Bearer ${data.accessToken}` },
                        credentials: "include",
                    }
                );

                if (!userRes.ok || userRes.status === 403) {
                   alert("Your session has expired!");
                    setLoading(false);
                    return;
                }

                const userInfo = await userRes.json();
                sessionStorage.setItem("userDetails", JSON.stringify(userInfo));
                navigate("/home");
            } catch (err) {
               // console.error(err);
              //   ExceptionHandler.handle(err);
              alert("Couldn't connect to server!");
                setLoading(false); // show form
            }
        };

        autoLogin();
    }, [navigate]);

    const handleSubmit = async (e) => {
     e.preventDefault();
    setError(""); 
        try {
            const response = await fetch(
                 API_LOGIN,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                    credentials: "include",
                }
            );

            if (response.status === 401) {
               setError("Invalid username or password!"); 
                return;
            }

            const data = await response.json();
            sessionStorage.setItem("accessToken", data.token);

            const userRes = await fetch(
                "http://localhost:8000/api/admin/data",
                {
                    headers: { Authorization: `Bearer ${data.token}` },
                    credentials: "include",
                }
            );

            if (!userRes.ok) {
                setError("Failed to fetch user data!"); 
                return;
            }

            const userInfo = await userRes.json();
            sessionStorage.setItem("userDetails", JSON.stringify(userInfo));

            navigate("/home");
        } catch (err) {
          //  console.error(err);
           // ExceptionHandler.handle(err);
          setError("Couldn't reach server!"); 
        }
    };

    if (loading) return <p>Checking session...</p>;

    return (
        <div className="login-container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                {error && <p className="error-label">{error}</p>}
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default LoginView;
