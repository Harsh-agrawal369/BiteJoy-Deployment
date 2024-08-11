import React, { useEffect, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";

const LoginPopup = ({ setShowLogin }) => {
  const [loginState, setLoginState] = useState("Sign Up");
  const [error, setError] = useState("");

  const { API_URL } = useContext(StoreContext);
  const { token, setToken , name, setName, loadCartData } = useContext(StoreContext);

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPass: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (e) => {
    e.preventDefault(); // Preventing default form submission

    let newUrl = `${API_URL}`;

    if (loginState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }

    try {
      const response = await axios.post(newUrl, data);

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("name", response.data.name);
        setToken(response.data.token);
        setName(response.data.name);
        setShowLogin(false);
        loadCartData(localStorage.getItem("token"));
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h1>{loginState}</h1>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
        </div>
        <div className="login-popup-input">
          {error && <p className="error">{error}</p>}
          {loginState === "Sign Up" && (
            <input
              name="name"
              type="text"
              onChange={onChangeHandler}
              value={data.name}
              placeholder="Enter Your Name"
              required
            />
          )}
          <input
            name="email"
            type="email"
            onChange={onChangeHandler}
            value={data.email}
            placeholder="Enter Your Email"
            required
          />
          <input
            name="password"
            type="password"
            onChange={onChangeHandler}
            value={data.password}
            placeholder="Enter Password"
            required
          />
          {loginState === "Sign Up" && (
            <>
              <input
                name="confirmPass"
                type="password"
                onChange={onChangeHandler}
                value={data.confirmPass}
                placeholder="Confirm Password"
                required
              />
              <p>
                Password must contain 1 Uppercase character, 1 special
                character, 1 digit with a minimum length of 8
              </p>
            </>
          )}
        </div>
        <button type="submit">
          {loginState === "Sign Up" ? "Create Account" : "Login"}
        </button>
        <div className="login-popup-cond">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use and Policies</p>
        </div>
        {loginState === "Sign Up" ? (
          <p>
            Already have an Account.{" "}
            <span onClick={() => setLoginState("Login")}>Login Here</span>
          </p>
        ) : (
          <p>
            Create a new Account?{" "}
            <span onClick={() => setLoginState("Sign Up")}>Click Here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
