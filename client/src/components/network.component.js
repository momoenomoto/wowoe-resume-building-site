import React, { Component } from "react";
import { getBaseURL } from "../http.js";
import background from "../img/background.jpg";
import Button from "react-bootstrap/Button";

export default class Network extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearch = this.onChangeSearch.bind(this);
    this.executeScroll = this.executeScroll.bind(this);
    this.search = this.search.bind(this);

    this.networkRef = React.createRef();

    this.state = {
      users: [],
      search: "",
      message: "",
    };
  }

  componentDidMount() {
    fetch(getBaseURL() + "/network", { mode: "cors" })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else throw new Error(response.statusText);
      })
      .then((data) => {
        this.setState({
          users: data.users,
        });
        // console.log(data);
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

  executeScroll() {
    this.networkRef.current.scrollIntoView(true);
  }

  search() {
    fetch(getBaseURL() + `/network?name=${this.state.search}`, {
      mode: "cors",
    })
      .then((response) => {
        if (response.ok) return response.json();
        else throw new Error(response.statusText);
      })
      .then((data) => {
        console.log(data);
        this.setState({
          users: data.users,
        });
        // console.log(data);
      })
      .catch((e) => {
        console.log(e);
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
            minWidth: "800px",
            width: "100%",
            backgroundSize: "cover",
            // left: "-90px",
          }}
        />

        <h1
          className="intro"
          style={{
            position: "absolute",
            top: "200px",
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
            top: "350px",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            textAlign: "center",
            // marginTop: "500px",
          }}
        >
          or scroll down to view the network
          <br />
          <button
            type="button"
            className="btn btn-default"
            onClick={this.executeScroll}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="white"
              className="bi bi-arrow-down-circle"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"
              />
            </svg>
          </button>
        </span>

        {/* <div style={{ position: "relative" }}></div> */}
        {/* {this.state.message}! Try logging in to see more. */}

        <div style={{ marginTop: "auto" }}>
          <h2 className="d-inline-block" ref={this.networkRef}>
            Network
          </h2>
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
        {this.state.users
          ? this.state.users.map((user, index) => (
              <div
                className="d-inline-block"
                style={{ overflow: "auto", width: "50%", margin: "0 auto" }}
                key={index}
              >
                {user.published.photo ? (
                  <a href={"/resume/" + user.published.id}>
                    <img
                      className="photo"
                      src={user.published.photo}
                      width="80"
                      height="80"
                      alt=""
                      style={{
                        borderRadius: "50%",
                        maxHeight: "200px",
                        display: "inline-block",
                        float: "left",
                        margin: "20px",
                      }}
                    />
                  </a>
                ) : (
                  <a href={"/resume/" + user.published.id}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="80"
                      height="80"
                      fill="currentColor"
                      className="bi bi-person-circle"
                      viewBox="0 0 16 16"
                      style={{
                        color: "lightgray",
                        display: "inline-block",
                        margin: "20px",
                        float: "left",
                      }}
                    >
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                      <path
                        fillRule="evenodd"
                        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                      />
                    </svg>
                  </a>
                )}
                <div style={{ float: "left" }}>
                  <a
                    href={"/resume/" + user.published.id}
                    style={{ textDecoration: "none" }}
                    className="network-link"
                  >
                    <h3 style={{ paddingTop: "30px" }}>
                      {user.published.name}
                    </h3>
                  </a>
                  <p>{user.published.title}</p>
                </div>
              </div>
            ))
          : null}
      </div>
    );
  }
}
