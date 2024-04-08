import React, { useState } from "react";
import "./Login.css";
import LoginForm from "./LoginContainer";
import Logo from "./Login-assets/login-logo.svg";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import swal from "sweetalert2";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(false) علشان اعمل انتظار علي التحميل عقبال ما الريسبونس تيجي
  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(
        "https://raknaapi.azurewebsites.net/api/Auth/Login",
        {
          email: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        sessionStorage.setItem("accessToken", response.data.token);
        console.log(response.data.isAuthenticated);

        if (response.data.token) {
          handleLoginToken(response.data.token);
        } else if (
          response.data.isAuthenticated === false &&
          response.data.message === "Email is not confirmed yet!"
        ) {
          navigate("");
          swal.fire("Error", "please, verify your account", "error");
        }else if (
          response.data.isAuthenticated === false &&
          response.data.message === "Email or Password is incorrect!"
        ) {
          navigate("");
          swal.fire("Error", "Email or Password is incorrect", "error");
        }
        
      } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  };

  const handleLoginToken = (token) => {
    if (sessionStorage.getItem("accessToken") !== "undefined") {
      try {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.roles;
        console.log(userRole);
        if (navigate) {
          // Ensure navigate is available
          if (userRole === "garageadmin") {
            navigate("/SystemAdmin");
          } else if (userRole === "garagestaff") {
            navigate("/GarageStaff");
          } else if (userRole === "customerservice") {
            navigate("/CustomerService");
          } else if (userRole === "technicalsupport") {
            navigate("/TechnicalSupport");
          }
        } else {
          navigate("");
          swal("Error", "login failed", "error");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } 
  };

  return (
    <div className="login-container">
      <div className="Logo">
        <img src={Logo} alt="logo" />
        <p>To reshape the future of parking</p>
      </div>
      <div className="App">
        <h1>Login</h1>
        {error && <div className="error">{error}</div>}
        <LoginForm
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      </div>
    </div>
  );
}

export default App;
