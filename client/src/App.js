import React, { Component } from "react";
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

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: null,
      showMyResumes: false,
    };
  }

  componentDidMount() {
    const user = getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showMyResumes: true,
      });
    }
  }

  logOut() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // credentials: "include",
      // AccessControlAllowCredentials: "true",
    };
    fetch(getBaseURL() + "/logout", requestOptions).then(() => {
      // console.log("test");
      this.setState({
        currentUser: null,
        showMyResumes: false,
      });
      localStorage.removeItem("user");
      // this.props.router.navigate("/");
      // window.location.reload();
    });
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <a href="/" className="navbar-brand">
            <img
              className="block"
              src={logo}
              width="50"
              style={{ position: "relative", left: "10px" }}
            />
          </a>
          <div className="navbar-nav mr-auto">
            {this.state.showMyResumes && (
              <li className="nav-item">
                <Link to={"/resumes"} className="nav-link">
                  My Resumes
                </Link>
              </li>
            )}
          </div>
          <div className="navbar-nav ms-auto">
            {this.state.currentUser ? (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/profile"} className="nav-link">
                    {this.state.currentUser.username}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={"/"} className="nav-link" onClick={this.logOut}>
                    LogOut
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
          {/* <li className="nav-item">
              <Link to={"/add"} className="nav-link">
                Add
              </Link>
            </li> */}
        </nav>

        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<Network />} />
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
