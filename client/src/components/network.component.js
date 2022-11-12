import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getBaseURL } from "../http.js";

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
      <div className="container">
        {/* {this.state.message}! Try logging in to see more. */}
        <div>
          <h2 className="d-inline-block">Network</h2>
          <div
            className="d-inline-block"
            style={{
              position: "relative",
              top: "-5px",
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
