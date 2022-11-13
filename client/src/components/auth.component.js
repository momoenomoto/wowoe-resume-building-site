import React, { Component } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { getBaseURL } from "../http.js";
import { withRouter } from "../with-router";

class Auth extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.handleValidation = this.handleValidation.bind(this);

    this.state = {
      formValues: {
        username: "",
        email: "",
        password: "",
      },
      formErrors: {
        username: "",
        email: "",
        password: "",
      },
      formValidity: {
        username: false,
        email: false,
        password: false,
      },
      message: "",
      isSubmitting: false,
    };
  }

  handleChangeLogin = ({ target }) => {
    const { formValues } = this.state;
    formValues[target.name] = target.value;
    this.setState({ formValues });
  };

  handleChange = ({ target }) => {
    const { formValues } = this.state;
    formValues[target.name] = target.value;
    this.setState({ formValues });
    this.handleValidation(target);
  };

  handleValidation = (target) => {
    const { name, value } = target;
    const fieldValidationErrors = this.state.formErrors;
    const validity = this.state.formValidity;
    const isUsername = name === "username";
    const isEmail = name === "email";
    const isPassword = name === "password";
    const emailTest = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const usernameTest = /^([a-zA-Z0-9]|[-._](?![-._])){8,20}$/;

    validity[name] = value.length > 0;
    fieldValidationErrors[name] = validity[name]
      ? ""
      : `${name} is required and cannot be empty`;
    if (validity[name]) {
      if (isUsername) {
        validity[name] = usernameTest.test(value);
        fieldValidationErrors[name] = validity[name]
          ? ""
          : `${name} should be between 8 and 20 characters, contains only letters, numbers, and special characters (-._), and special characters must not be used consecutively`;
      }
      if (isEmail) {
        validity[name] = emailTest.test(value);
        fieldValidationErrors[name] = validity[name]
          ? ""
          : `${name} should be a valid email address`;
      }
      if (isPassword) {
        validity[name] = value.length >= 8 && value.length <= 40;
        fieldValidationErrors[name] = validity[name]
          ? ""
          : `${name} should be between 8 and 40 characters`;
      }
    }
    this.setState({
      formErrors: fieldValidationErrors,
      formValidity: validity,
    });
  };

  login(evt) {
    evt.preventDefault();

    this.setState({
      isSubmitting: true,
      message: "",
    });
    const { formValues } = this.state;

    const data = {
      username: formValues.username,
      password: formValues.password,
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", mode: "cors" },
      body: JSON.stringify(data),
      // credentials: "include",
      // AccessControlAllowCredentials: "true",
    };
    fetch(getBaseURL() + "/login", requestOptions)
      .then((response) => {
        if (response.ok) return response.json();
        else throw new Error(response.statusText);
      })
      .then((data) => {
        // console.log(data);
        if (data.user) {
          this.setState({
            isSubmitting: false,
          });
          localStorage.setItem(
            "user",
            JSON.stringify({ username: data.user.username })
          );
          this.props.router.navigate("/resumes");
          window.location.reload();
        } else {
          this.setState({
            message: data.message,
            isSubmitting: false,
          });
        }
      })
      .catch((e) => {
        this.setState({
          isSubmitting: false,
          message: e.message,
        });
        console.log(e);
      });
  }

  register(evt) {
    evt.preventDefault();

    this.setState({
      isSubmitting: true,
      message: "",
    });

    const { formValues, formValidity } = this.state;
    if (Object.values(formValidity).every(Boolean)) {
      // alert("Form is validated! Submitting the form...");
      const data = {
        username: formValues.username,
        password: formValues.password,
        email: formValues.email,
      };

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json", mode: "cors" },
        body: JSON.stringify(data),
        // credentials: "include",
        // headers: { "Access-Control-Allow-Credentials": true },
      };

      fetch(getBaseURL() + "/register", requestOptions)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else throw new Error(response.statusText);
        })
        .then((data) => {
          // console.log(data);
          this.setState({
            message: data.message,
            isSubmitting: false,
          });
          localStorage.setItem("user", JSON.stringify(data.user));
          this.props.router.navigate("/resumes");
          window.location.reload();
        })
        .catch((e) => {
          this.setState({
            isSubmitting: false,
            message: e.message,
          });
          console.log(e);
        });
    } else {
      for (let key in formValues) {
        let target = {
          name: key,
          value: formValues[key],
        };
        this.handleValidation(target);
      }
      this.setState({ isSubmitting: false });
    }
  }

  // onSubmit = (evt) => {
  //   evt.preventDefault();
  // };

  render() {
    return (
      <Container fluid="md">
        <div
          style={{
            display: "block",
            textAlign: "center",
          }}
        >
          <Tabs
            variant="pills"
            defaultActiveKey="login"
            id="auth"
            className="mb-4 justify-content-center text-center d-flex"
          >
            <Tab eventKey="login" title="Login">
              <div
                style={{
                  display: "block",
                  textAlign: "center",
                }}
              >
                <Form
                  onSubmit={this.login}
                  style={{ display: "inline-block", width: "300px" }}
                >
                  <FloatingLabel
                    controlId="floatingInputLogin"
                    label="Username"
                    className="mb-3"
                    style={{ color: "gray" }}
                  >
                    <Form.Control
                      type="text"
                      placeholder="Username"
                      name="username"
                      className={`form-control ${
                        this.state.formErrors.username ? "is-invalid" : ""
                      }`}
                      onChange={this.handleChangeLogin}
                      value={this.state.formValues.username}
                      // required
                    />
                  </FloatingLabel>

                  <FloatingLabel
                    controlId="floatingPasswordLogin"
                    label="Password"
                    className="mb-3"
                    style={{
                      color: "gray",
                    }}
                  >
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      name="password"
                      className={`form-control ${
                        this.state.formErrors.password ? "is-invalid" : ""
                      }`}
                      onChange={this.handleChangeLogin}
                      value={this.state.formValues.password}
                    />
                  </FloatingLabel>
                  {this.state.message && (
                    <div className="form-group">
                      <div className="alert alert-danger" role="alert">
                        {this.state.message}
                      </div>
                    </div>
                  )}
                  <Button
                    variant="secondary"
                    type="submit"
                    style={{ width: "300px" }}
                    disabled={this.state.isSubmitting}
                  >
                    {this.state.isSubmitting ? "Please wait..." : "Login"}
                  </Button>
                </Form>
              </div>
            </Tab>

            <Tab eventKey="register" title="Register">
              <div
                style={{
                  display: "block",
                  textAlign: "center",
                }}
              >
                <Form
                  style={{ display: "inline-block", width: "300px" }}
                  onSubmit={this.register}
                >
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Username"
                    className="mb-3"
                    style={{ color: "gray" }}
                  >
                    <Form.Control
                      type="text"
                      placeholder="Username"
                      name="username"
                      className={`form-control ${
                        this.state.formErrors.username ? "is-invalid" : ""
                      }`}
                      onChange={this.handleChange}
                      value={this.state.formValues.username}
                      // required
                    />
                    {/* <Form.Text id="usernameHelpBlock" muted>
                      Username must be 8-20 characters long, containing only
                      letters, numbers, and special characters (-._)
                    </Form.Text> */}
                    <div className="invalid-feedback">
                      {this.state.formErrors.username}
                    </div>
                  </FloatingLabel>

                  <FloatingLabel
                    controlId="floatingEmail"
                    label="Email address"
                    className="mb-3"
                    style={{ color: "gray" }}
                  >
                    <Form.Control
                      type="email"
                      placeholder="name@example.com"
                      name="email"
                      className={`form-control ${
                        this.state.formErrors.email ? "is-invalid" : ""
                      }`}
                      onChange={this.handleChange}
                      value={this.state.formValues.email}
                    />
                    <div className="invalid-feedback">
                      {this.state.formErrors.email}
                    </div>
                  </FloatingLabel>

                  <FloatingLabel
                    controlId="floatingPassword"
                    label="Password"
                    style={{ color: "gray" }}
                    className="mb-3"
                  >
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      name="password"
                      className={`form-control ${
                        this.state.formErrors.password ? "is-invalid" : ""
                      }`}
                      onChange={this.handleChange}
                      value={this.state.formValues.password}
                    />
                    {/* <Form.Text id="passwordHelpBlock" muted>
                      Password must be 8-40 characters long
                    </Form.Text> */}
                    <div className="invalid-feedback">
                      {this.state.formErrors.password}
                    </div>
                  </FloatingLabel>

                  {this.state.message && (
                    <div className="form-group">
                      <div className="alert alert-danger" role="alert">
                        {this.state.message}
                      </div>
                    </div>
                  )}

                  <Button
                    variant="secondary"
                    type="submit"
                    style={{ width: "300px" }}
                    disabled={this.state.isSubmitting}
                  >
                    {this.state.isSubmitting ? "Please wait..." : "Register"}
                  </Button>
                </Form>
              </div>
            </Tab>
          </Tabs>
        </div>
      </Container>
    );
  }
}

export default withRouter(Auth);
