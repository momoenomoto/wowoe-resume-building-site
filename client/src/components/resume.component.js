import React, { Component } from "react";
import { withRouter } from "../with-router";
const baseURL = "http://localhost:3000";

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
    fetch(baseURL + "/resume/" + id)
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
        <h2>{this.state.currentResume.resumetitle}</h2>

        {Object.keys(this.state.currentResume).map((val, index) => (
          <div key={index}>
            {val} : {this.state.currentResume[val]}
          </div>
        ))}
      </>
    );
  }
}

export default withRouter(Resume);
