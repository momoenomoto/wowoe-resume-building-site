import React, { Component } from "react";
import { withRouter } from "../with-router";
import { getBaseURL } from "../http.js";

class Resume extends Component {
  constructor(props) {
    super(props);
    this.getResume = this.getResume.bind(this);

    this.state = {
      currentResume: {
        id: null,
        resumetitle: "",
        name: "",
        title: "",
        //photo: null,
        email: "",
        phone: "",
        loc: "",
      },
      message: "",
    };
  }

  componentDidMount() {
    this.getResume(this.props.router.params.id);
  }

  getResume(id) {
    fetch(getBaseURL() + "/resume/" + id)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          currentResume: data,
        });
        console.log(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    return (
      <>
        <h1 style={{ fontWeight: "bold" }}>{this.state.currentResume.name}</h1>

        <div
          style={{
            width: "80vw",
            height: "10px",
            backgroundColor: "lightgray",
            position: "absolute",
            top: "155px",
            color: "black",
          }}
        ></div>
        <div
          style={{
            backgroundColor: "lightgray",
            height: "40px",
            textAlign: "center",
            maxWidth: "max-content",
            padding: "5px 10px",
            fontSize: "20px",
            color: "white",
            position: "absolute",
            right: "70px",
            top: "140px",
            fontWeight: "bold",
          }}
        >
          {this.state.currentResume.title}
        </div>
        <div
          className="resumeContent"
          style={{ position: "relative", top: "50px" }}
        >
          {this.state.currentResume.email && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-envelope"
              viewBox="0 0 16 16"
            >
              <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
            </svg>
          )}

          {Object.keys(this.state.currentResume).map((val, index) => (
            <div key={index}>
              {val} : {this.state.currentResume[val]}
            </div>
          ))}
        </div>
      </>
    );
  }
}

export default withRouter(Resume);
