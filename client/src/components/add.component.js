import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Button from "react-bootstrap/Button";
import { getBaseURL } from "../http.js";
// const baseURL = process.env.BASEURL || "http://localhost:3000";

export default class Add extends Component {
  constructor(props) {
    super(props);
    this.onChangeResumeTitle = this.onChangeResumeTitle.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    //this.onChangePhoto = this.onChangePhoto.bind(this);
    this.onChangeEmail = this.onChangeTitle.bind(this);
    this.onChangePhone = this.onChangePhone.bind(this);
    this.onChangeLoc = this.onChangeLoc.bind(this);
    //this.onChangeLastEdited = this.onChangeLastEdited.bind(this);
    this.saveResume = this.saveResume.bind(this);

    this.state = {
      id: null,
      resumetitle: "",
      name: "",
      title: "",
      //photo: null,
      email: "",
      phone: "",
      loc: "",
      //lastEdited: new Date().toLocaleString(),
      //details: [],
      published: false,
      submitted: false,
    };
  }
  onChangeResumeTitle(e) {
    this.setState({
      resumetitle: e.target.value,
    });
  }
  onChangeName(e) {
    this.setState({
      name: e.target.value,
    });
  }
  onChangeTitle(e) {
    this.setState({
      title: e.target.value,
    });
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value,
    });
  }

  onChangePhone(e) {
    this.setState({
      phone: e.target.value,
    });
  }

  onChangeLoc(e) {
    this.setState({
      loc: e.target.value,
    });
  }

  addDetail() {
    // this.setState({
    //   details: this.state.details.push(""),
    // });
  }

  onChangeDetail(i, e) {
    // this.setState({
    //   details: (this.state.details[i] = e.target.value),
    // });
  }

  saveResume() {
    const data = {
      resumetitle: this.state.resumetitle,
      name: this.state.name,
      title: this.state.title,
      email: this.state.email,
      phone: this.state.phone,
      loc: this.state.loc,
    };

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

    fetch(getBaseURL() + "/resume/add", requestOptions)
      .then((response) => {
        this.setState({
          id: response.data.id,
          resumetitle: response.data.resumetitle,
          name: response.data.name,
          title: response.data.title,
          email: response.data.email,
          phone: response.state.phone,
          loc: response.data.loc,
          //published: response.data.published,
          submitted: true,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    return (
      <>
        <Form>
          <Row className="justify-content-md-center">
            <Col xs lg="3">
              <FloatingLabel
                controlId="floatingInput"
                label="Resume Title"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  placeholder="Enter resume title"
                  required
                  onChange={this.onChangeResumeTitle}
                />
              </FloatingLabel>

              {/* <Form.Group className="mb-3" controlId="formGridName">
              <Form.Label>Resume Name</Form.Label>
              <Form.Control type="text" placeholder="Enter resume name" />
            </Form.Group> */}
            </Col>
          </Row>
          <hr />
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="text" required onChange={this.onChangeName} />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridJobTitle">
              <Form.Label>Job Title</Form.Label>
              <Form.Control type="text" onChange={this.onChangeTitle} />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" onChange={this.onChangeEmail} />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridPhone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="text" onChange={this.onChangePhone} />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridLoc">
              <Form.Label>Location</Form.Label>
              <Form.Control type="text" onChange={this.onChangeloc} />
            </Form.Group>
          </Row>

          {/* <Form.Group controlId="formGridDetails">
          {this.state.details &&
            this.state.details.map((detail, index) => (
              <Form.Control
                className="mb-3"
                key={index}
                type="text"
                placeholder="enter"
              />
            ))}
        </Form.Group> */}
          <Button
            variant="outline-success"
            className="mb-3"
            onClick={this.addDetail}
          >
            Add additional details
          </Button>
          <hr />
          <Row>
            <Button
              variant="outline-secondary"
              className="mb-3"
              size="lg"
              onClick={this.addSection}
            >
              Add Section
            </Button>
          </Row>
          <Row>
            <Button
              type="submit"
              onClick={this.saveResume}
              className="btn btn-success"
            >
              Save
            </Button>
          </Row>

          {/* <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridName">
          <Form.Label>Resume Name</Form.Label>
          <Form.Control type="text" placeholder="Enter resume name" />
        </Form.Group>
            </Row> */}
        </Form>
      </>
    );
  }
}
