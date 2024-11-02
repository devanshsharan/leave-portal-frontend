import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Css/Loginpage.css";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentToken, setCredentials } from "./features/auth/authSlice";
import CryptoJS from "crypto-js";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showGuestOptions, setShowGuestOptions] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwt = useSelector(selectCurrentToken);
  const iv = CryptoJS.lib.WordArray.random(16);
  const secretKey = import.meta.env.VITE_SECRET_KEY;

  useEffect(() => {
    if (jwt) {
      navigate(`/home`);
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Both fields are required.");
      alert("Both fields are required");
      return;
    }

    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      CryptoJS.enc.Utf8.parse(secretKey),
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    const encryptedData = iv.concat(encryptedPassword.ciphertext);
    const encryptedDataBase64 = encryptedData.toString(CryptoJS.enc.Base64);

    try {
      const response = await fetch(
        "https://leave-portal-backend-1.onrender.com/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            username: username,
            password: encryptedDataBase64,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed. Please try again.");
      }

      const data = await response.json();
      dispatch(
        setCredentials({
          role: data.role,
          employeeId: data.employeeId,
          accessToken: data.jwt,
        })
      );

      navigate("/home");
    } catch (err) {
      setError(err.message);
      alert(err.message);
    }
  };

  const handleGuestLogin = (role) => {
    switch (role) {
      case "admin":
        setUsername("admin");
        setPassword("a@123");
        break;
      case "manager":
        setUsername("sohan");
        setPassword("s@123");
        break;
      case "employee":
        setUsername("rohan");
        setPassword("r@123");
        break;
      default:
        break;
    }
  };

  return (
    <div className="loginpage">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username: </label>
          <input
            className="login-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Login</button>
        {error && <div className="error">{error}</div>}
        <div className="guest">
          <button
            type="button"
            className="guest-login-btn"
            onClick={() => setShowGuestOptions(!showGuestOptions)}
          >
            {showGuestOptions ? "Close" : "Login as Guest"}
          </button>

          {showGuestOptions && (
            <div>
              <button
                type="button"
                className="guest-option-btn"
                onClick={() => handleGuestLogin("admin")}
              >
                Guest as Admin
              </button>
              <button
                type="button"
                className="guest-option-btn"
                onClick={() => handleGuestLogin("manager")}
              >
                Guest as Manager
              </button>
              <button
                type="button"
                className="guest-option-btn"
                onClick={() => handleGuestLogin("employee")}
              >
                Guest as Employee
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default Login;
