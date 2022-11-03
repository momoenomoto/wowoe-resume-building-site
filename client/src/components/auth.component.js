import React, { Component } from "react";
import { Link } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";

export default class Auth extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container fluid="md">
        <Tabs
          variant="pills"
          defaultActiveKey="login"
          id="auth"
          className="mb-4 justify-content-md-center text-center"
        >
          <Tab eventKey="login" title="Login">
            <Form>
              <Row className="justify-content-md-center">
                <Col lg="3">
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Username"
                    className="mb-3"
                  >
                    <Form.Control type="text" placeholder="Username" />
                  </FloatingLabel>

                  {/* <Form.Group className="mb-4" controlId="formBasicText">
                    <Form.Control type="text" placeholder="Username" />
                  </Form.Group> */}
                </Col>
              </Row>
              <Row className="justify-content-md-center">
                <Col lg="3">
                  <FloatingLabel controlId="floatingPassword" label="Password">
                    <Form.Control type="password" placeholder="Password" />
                  </FloatingLabel>

                  {/* <Form.Group className="mb-4" controlId="formBasicPassword">
                    <Form.Control type="password" placeholder="Password" />
                  </Form.Group> */}
                </Col>
              </Row>
              <Row className="text-center m-3">
                <Col>
                  <Button variant="secondary" type="submit">
                    Login
                  </Button>
                </Col>
              </Row>
            </Form>
          </Tab>

          <Tab eventKey="register" title="Register">
            <Form>
              <Row className="justify-content-md-center">
                <Col lg="3">
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Username"
                    className="mb-3"
                  >
                    <Form.Control type="text" placeholder="Username" />
                  </FloatingLabel>

                  {/* <Form.Group className="mb-4" controlId="formBasicText">
                    <Form.Control type="text" placeholder="Username" />
                  </Form.Group> */}
                </Col>
              </Row>

              <Row className="justify-content-md-center">
                <Col lg="3">
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Email address"
                    className="mb-3"
                  >
                    <Form.Control type="email" placeholder="name@example.com" />
                  </FloatingLabel>
                  {/* 
                  <Form.Group className="mb-4" controlId="formBasicEmail">
                    <Form.Control type="email" placeholder="Email" />
                  </Form.Group> */}
                </Col>
              </Row>

              <Row className="justify-content-md-center">
                <Col lg="3">
                  <FloatingLabel controlId="floatingPassword" label="Password">
                    <Form.Control type="password" placeholder="Password" />
                  </FloatingLabel>

                  {/* <Form.Group className="mb-4" controlId="formBasicPassword">
                    <Form.Control type="password" placeholder="Password" />
                  </Form.Group> */}
                </Col>
              </Row>

              <Row className="text-center m-3">
                <Col>
                  <Button variant="secondary" type="submit">
                    Register
                  </Button>
                </Col>
              </Row>
            </Form>
          </Tab>
        </Tabs>
      </Container>
    );
  }
}
