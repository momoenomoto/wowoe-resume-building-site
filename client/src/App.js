import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AllResumes from "./components/all.component.js";
import Auth from "./components/auth.component.js";
import Add from "./components/add.component.js";
import Resume from "./components/resume.component.js";

class App extends Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <a href="/" className="navbar-brand">
            &nbsp; &nbsp; wowoe
          </a>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/"} className="nav-link">
                My Resumes
              </Link>
            </li>
          </div>
          <div className="navbar-nav ms-auto">
            <li className="nav-login">
              <Link to={"/auth"} className="nav-link">
                <button
                  class="btn btn-outline-success mr-auto my-2 my-sm-0"
                  type="button"
                >
                  Login | Register
                </button>
              </Link>
            </li>
          </div>
          {/* <li className="nav-item">
              <Link to={"/add"} className="nav-link">
                Add
              </Link>
            </li> */}
        </nav>

        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<AllResumes />} />
            <Route path="/resumes" element={<AllResumes />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/resume/add" element={<Add />} />
            <Route path="/resume/:id" element={<Resume />} />
          </Routes>
        </div>
      </div>
    );
  }
}

export default App;
