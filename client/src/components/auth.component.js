import React, { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { getBaseURL } from "../http.js";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [formValidity, setFormValidity] = useState({
    username: false,
    email: false,
    password: false,
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  function handleChangeLogin({ target }) {
    setFormValues((prev) => {
      formValues[target.name] = target.value;
      return { ...prev, formValues };
    });
  }

  function handleChangeRegister({ target }) {
    setFormValues((prev) => {
      formValues[target.name] = target.value;
      return { ...prev, formValues };
    });
    handleValidation(target);
  }

  function handleValidation(target) {
    const { name, value } = target;
    const fieldValidationErrors = formErrors;
    const validity = formValidity;
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
    setFormErrors(fieldValidationErrors);
    setFormValidity(validity);
  }

  function login(evt) {
    evt.preventDefault();

    setIsSubmitting(true);
    setMessage("");

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
          setIsSubmitting(false);
          localStorage.setItem(
            "user",
            JSON.stringify({ username: data.user.username })
          );
          navigate("/resumes");
          window.location.reload();
        } else {
          setMessage(data.message);
          setIsSubmitting(false);
        }
      })
      .catch((e) => {
        setMessage(e.message);
        setIsSubmitting(false);
        console.log(e);
      });
  }

  function register(evt) {
    evt.preventDefault();

    setMessage("");
    setIsSubmitting(true);

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
          setMessage(data.message);
          setIsSubmitting(false);

          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/resumes");
          window.location.reload();
        })
        .catch((e) => {
          setMessage(e.message);
          setIsSubmitting(false);
          console.log(e);
        });
    } else {
      for (let key in formValues) {
        let target = {
          name: key,
          value: formValues[key],
        };
        handleValidation(target);
      }
      setIsSubmitting(false);
    }
  }

  return (
    <>
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
          className="mb-4 justify-content-center text-center d-flex mt-4"
        >
          <Tab eventKey="login" title="Login">
            <div
              style={{
                display: "block",
                textAlign: "center",
              }}
            >
              <Form
                onSubmit={login}
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
                      formErrors.username ? "is-invalid" : ""
                    }`}
                    onChange={handleChangeLogin}
                    value={formValues.username}
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
                      formErrors.password ? "is-invalid" : ""
                    }`}
                    onChange={handleChangeLogin}
                    value={formValues.password}
                  />
                </FloatingLabel>
                {message && (
                  <div className="form-group">
                    <div className="alert alert-danger" role="alert">
                      {message}
                    </div>
                  </div>
                )}
                <Button
                  variant="secondary"
                  type="submit"
                  style={{ width: "300px" }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Please wait..." : "Login"}
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
                onSubmit={register}
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
                      formErrors.username ? "is-invalid" : ""
                    }`}
                    onChange={handleChangeRegister}
                    value={formValues.username}
                    // required
                  />
                  {/* <Form.Text id="usernameHelpBlock" muted>
                      Username must be 8-20 characters long, containing only
                      letters, numbers, and special characters (-._)
                    </Form.Text> */}
                  <div className="invalid-feedback">{formErrors.username}</div>
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
                      formErrors.email ? "is-invalid" : ""
                    }`}
                    onChange={handleChangeRegister}
                    value={formValues.email}
                  />
                  <div className="invalid-feedback">{formErrors.email}</div>
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
                      formErrors.password ? "is-invalid" : ""
                    }`}
                    onChange={handleChangeRegister}
                    value={formValues.password}
                  />
                  {/* <Form.Text id="passwordHelpBlock" muted>
                      Password must be 8-40 characters long
                    </Form.Text> */}
                  <div className="invalid-feedback">{formErrors.password}</div>
                </FloatingLabel>

                {message && (
                  <div className="form-group">
                    <div className="alert alert-danger" role="alert">
                      {message}
                    </div>
                  </div>
                )}

                <Button
                  variant="secondary"
                  type="submit"
                  style={{ width: "300px" }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Please wait..." : "Register"}
                </Button>
              </Form>
            </div>
          </Tab>
        </Tabs>
      </div>
    </>
  );
}
