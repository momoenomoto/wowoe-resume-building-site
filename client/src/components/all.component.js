import React, { Component } from "react";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { getBaseURL } from "../http.js";
import icon from "../img/resume_icon.jpg";

export default class AllResumes extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearch = this.onChangeSearch.bind(this);
    this.retrieveResumes = this.retrieveResumes.bind(this);
    this.refreshResumes = this.refreshResumes.bind(this);
    this.setActiveResume = this.setActiveResume.bind(this);
    //this.removeAllResumes = this.removeAllResumes.bind(this);
    this.search = this.search.bind(this);

    this.state = {
      resumes: [],
      currentResume: null,
      currentIndex: -1,
      search: "",
    };
  }

  componentDidMount() {
    this.retrieveResumes();
  }

  onChangeSearch(e) {
    const search = e.target.value;

    this.setState({
      search: search,
    });
  }

  retrieveResumes() {
    fetch(getBaseURL() + "/resumes")
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          resumes: data.resumes,
        });
        console.log(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  refreshResumes() {
    this.retrieveResumes();
    this.setState({
      currentResume: null,
      currentIndex: -1,
    });
  }

  setActiveResume(resume, index) {
    this.setState({
      currentResume: resume,
      currentIndex: index,
    });
  }

  // removeAllResumes() {
  //   DataService.deleteAll()
  //     .then((response) => {
  //       console.log(response.data);
  //       this.refreshList();
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
  // }

  search() {
    fetch(getBaseURL() + "/resumes?resumetitle=${this.state.search}`")
      .then((response) => {
        this.setState({
          resumes: response.data.resumes,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-2 col-12">
            <h2>My Resumes</h2>
          </div>
          <div className="col-md-3 col-12">
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by resume name"
                value={this.state.search}
                onChange={this.onChangeSearch}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={this.refreshResumes}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="17"
                    fill="currentColor"
                    className="bi bi-search"
                    viewBox="0 1 17 15"
                  >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                  </svg>
                  <span className="visually-hidden">Search</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <a href="/resume/add">
              <button type="button" className="btn btn-outline-secondary mb-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-plus-square-dotted"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"></path>
                </svg>
                Create New Resume
              </button>
            </a>
          </div>
        </div>
        <div>
          {this.state.resumes.length
            ? this.state.resumes.map((resume, index) => (
                <figure
                  className="me-5 mb-5"
                  style={{ display: "inline-block", position: "relative" }}
                  key={index}
                >
                  <Link to={"/resume/" + resume.id}>
                    <img
                      className="block"
                      src={icon}
                      width="200"
                      height="200"
                    />
                    <figcaption
                      className="resumetitle text-center"
                      style={{ position: "absolute", width: "100%" }}
                    >
                      {resume.resumetitle}
                    </figcaption>
                  </Link>
                </figure>
              ))
            : "No resumes"}
        </div>
      </div>
    );
  }
}
