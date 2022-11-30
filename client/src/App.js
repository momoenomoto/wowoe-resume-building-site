import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AllResumes from "./components/all.component.js";
import Auth from "./components/auth.component.js";
import Add from "./components/add.component.js";
import Resume from "./components/resume.component.js";
import Network from "./components/network.component.js";
import logo from "./img/wowoe-logo.png";
import { getBaseURL, getCurrentUser } from "./http.js";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showMyResumes, setShowMyResumes] = useState(false);

  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        autoDisplay: false,
      },
      "google_translate_element"
    );
  };

  useEffect(() => {
    const user = getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowMyResumes(true);
    }

    var addScript = document.createElement("script");
    addScript.setAttribute(
      "src",
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    );
    document.body.appendChild(addScript);
    window.googleTranslateElementInit = googleTranslateElementInit;
  }, []);

  function logOut() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", mode: "cors" },
      // credentials: "include",
      // AccessControlAllowCredentials: "true",
    };
    fetch(getBaseURL() + "/logout", requestOptions).then(() => {
      // console.log("test");
      setCurrentUser(null);
      setShowMyResumes(false);

      localStorage.removeItem("user");
      // this.props.router.navigate("/");
      // window.location.reload();
    });
  }

  return (
    <>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/" className="navbar-brand">
          <img
            className="block"
            alt="logo"
            src={logo}
            width="50"
            style={{ position: "relative", left: "10px" }}
          />
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/network"} className="nav-link">
              Network
            </Link>
          </li>
          {showMyResumes && (
            <li className="nav-item">
              <Link to={"/resumes"} className="nav-link">
                My Resumes
              </Link>
            </li>
          )}
        </div>
        <div className="navbar-nav ms-auto">
          <div id="google_translate_element"></div>
          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <div className="nav-link">{currentUser.username}</div>
              </li>
              <li className="nav-item" style={{ border: "1px solid gray" }}>
                <Link to={"/"} className="nav-link" onClick={logOut}>
                  Logout
                </Link>
              </li>
            </div>
          ) : (
            <li className="nav-login">
              <Link to={"/auth"} className="nav-link">
                <button
                  className="btn btn-outline-success mr-auto my-2 my-sm-0"
                  type="button"
                >
                  Login | Register
                </button>
              </Link>
            </li>
          )}
          ;
        </div>
      </nav>

      <Routes>
        <Route path="/resumes" element={<AllResumes />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/network" element={<Network />} />
        <Route path="/user/:username" element={<Resume />} />
        <Route path="/resume/:id" element={<Resume />} />
        <Route path="/resume/edit/:id" element={<Add />} />
        <Route path="/resume/add" element={<Add />} />
        <Route path="/" element={<Network />} />
        <Route path="*" element={<Network />} />
      </Routes>
    </>
  );
}
