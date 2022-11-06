import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getBaseURL } from "../http.js";

export default class Network extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
    };
  }

  componentDidMount() {
    fetch(getBaseURL() + "/")
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

  render() {
    return (
      <div className="container">
        {this.state.message}! this page is the network page that has yet to be
        implemented. Try logging in to see more.
      </div>
    );
  }
}
