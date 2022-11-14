import React, { Component } from "react";
import { getBaseURL } from "../http.js";
import background from "../img/background.jpg";
import Button from "react-bootstrap/Button";

export default class Network extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearch = this.onChangeSearch.bind(this);

    this.state = {
      users: [],
      search: "",
      message: "",
    };
  }

  componentDidMount() {
    fetch(getBaseURL() + "/", { mode: "cors" })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else throw new Error(response.statusText);
      })
      .then((data) => {
        this.setState({
          message: data.message,
        });
        console.log(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  onChangeSearch(e) {
    const search = e.target.value;

    this.setState({
      search: search,
    });
  }

  render() {
    return (
      <div style={{ position: "relative" }}>
        <img
          alt=""
          className="block mb-3"
          src={background}
          style={{
            position: "relative",
            // top: "76px",
            // maxWidth: "100%",
            // height: "auto",
            width: "100%",
            backgroundSize: "cover",
            // left: "-90px",
          }}
        />

        <h1
          className="intro"
          style={{
            position: "absolute",
            top: "25%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            // marginTop: "500px",
          }}
        >
          WOWOE
          <br />
          Online Resume Builder
          <br />
          <Button
            href="/auth"
            type="button"
            variant="outline-dark"
            style={{ background: "pink", borderColor: "pink" }}
          >
            Build Your Own Resume
          </Button>
        </h1>
        <span
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            textAlign: "center",
            // marginTop: "500px",
          }}
        >
          or scroll down to view the network
        </span>
        {/* <div style={{ position: "relative" }}></div> */}
        {/* {this.state.message}! Try logging in to see more. */}

        <div style={{ marginTop: "auto" }}>
          <h2 className="d-inline-block">Network</h2>
          <div
            className="d-inline-block"
            style={{
              position: "relative",
              // top: "-5px",
              left: "30px",
              width: "25vw",
            }}
          >
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name"
                value={this.state.search}
                onChange={this.onChangeSearch}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={this.search}
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
      </div>
    );
  }
}
