import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Button from "react-bootstrap/Button";
import { getBaseURL, getCurrentUser } from "../http.js";
import { useNavigate, useParams } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
// import FileBase64 from "react-file-base64";

export default function Add() {
  const [resumeTitle, setResumeTitle] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loc, setLoc] = useState("");
  const [details, setDetails] = useState([]);
  const [sections, setSections] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [addMode, setAddMode] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) navigate("/");
    else if (id !== undefined) {
      getResumeById(id);
      setAddMode(false);
    }

    function getResumeById(id) {
      fetch(getBaseURL() + "/resume/" + id, { mode: "cors" })
        .then((response) => {
          if (response.ok) return response.json();
          else throw new Error(response.statusText);
        })
        .then((data) => {
          setResumeTitle(data.resumetitle);
          setName(data.name);
          setTitle(data.title);
          setPhoto(data.photo);
          setEmail(data.email);
          setPhone(data.phone);
          setLoc(data.loc);
          setDetails(data.details);
          setSections(data.sections);
          // console.log(data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [id, navigate]);

  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }

  function onChangeResumeTitle(e) {
    setResumeTitle(e.target.value);
  }

  function onChangeName(e) {
    setName(e.target.value);
  }

  function onChangeTitle(e) {
    setTitle(e.target.value);
  }

  async function onChangePhoto(e) {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setPhone(base64);
  }

  function onChangeEmail(e) {
    setEmail(e.target.value);
  }

  function onChangePhone(e) {
    setPhone(e.target.value);
  }

  function onChangeLoc(e) {
    setLoc(e.target.value);
  }

  function addDetail() {
    setDetails((prev) => [...prev, { name: "", value: "" }]);
  }

  function removeDetail(i) {
    const details_copy = details.slice();
    details_copy.splice(i, 1);
    setDetails(details_copy);
  }

  function onChangeDetail(i, e) {
    const temp = [...details];
    temp[i] = { ...temp[i], [e.target.name]: e.target.value };
    setDetails(temp);
  }

  function addSection() {
    setSections((prev) => [...prev, { name: "", data: [] }]);
  }

  function removeSection(sectionIdx) {
    setSections(sections.filter((_, i) => i !== sectionIdx));
    // console.log(sections);
  }

  function onChangeSectionName(i, e) {
    const temp = [...sections];
    temp[i] = { ...temp[i], name: e.target.value };
    setSections(temp);
  }

  function addItem(sectionIdx, eventKey) {
    // console.log(eventKey);

    const buttons = document.querySelectorAll(".addItemBtn");
    for (let i = 0; i < buttons.length; i++) buttons[i].style.display = "none";

    setSections((prev) => {
      const temp = [...prev];

      if (temp[sectionIdx].data === undefined) {
        temp[sectionIdx] = {
          ...temp[sectionIdx],
          type: eventKey,
          data: [""],
        };
      } else {
        temp[sectionIdx] = {
          ...temp[sectionIdx],
          type: eventKey,
          data: [...temp[sectionIdx].data, ""],
        };
      }

      // console.log(temp);

      return temp;
    });
  }

  function removeItem(sectionIdx, dataIdx) {
    if (sections[sectionIdx].data.length === 1) {
      const buttons = document.querySelectorAll(".addItemBtn");
      for (let i = 0; i < buttons.length; i++)
        buttons[i].style.display = "inline-block";
    }
    const temp = [...sections];
    temp[sectionIdx].data.splice(dataIdx, 1);

    setSections(temp);
  }

  function onChangeText(sectionIdx, e) {
    setSections((prev) => {
      const temp = [...prev];

      temp[sectionIdx].data = [e.target.value];

      return temp;
    });
  }

  function onChangeList(sectionIdx, dataIdx, e) {
    setSections((prev) => {
      const temp = [...prev];

      temp[sectionIdx].data = [...temp[sectionIdx].data];
      temp[sectionIdx].data[dataIdx] = e.target.value;

      return temp;
    });
  }

  function onChangeEntry(sectionIdx, dataIdx, e) {
    setSections((prev) => {
      const temp = [...prev];
      temp[sectionIdx].data = [...temp[sectionIdx].data];
      temp[sectionIdx].data[dataIdx] = {
        ...temp[sectionIdx].data[dataIdx],
        [e.target.name]: e.target.value,
      };

      return temp;
    });
  }

  function saveResume() {
    let data;
    if (addMode) {
      data = {
        resumetitle: resumeTitle,
        name,
        title,
        photo,
        email,
        phone,
        loc,
        details,
        sections,
        user: getCurrentUser(),
      };
    } else {
      data = {
        id,
        resumetitle: resumeTitle,
        name,
        title,
        photo,
        email,
        phone,
        loc,
        details,
        sections,
        user: getCurrentUser(),
      };
    }

    // console.log(data);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", mode: "cors" },
      body: JSON.stringify(data),
    };

    fetch(getBaseURL() + "/resume/add", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else throw new Error(response.statusText);
      })
      .then((data) => {
        // console.log(data);
        setResumeTitle(data.resumetitle);
        setName(data.name);
        setTitle(data.title);
        setPhoto(data.photo);
        setEmail(data.email);
        setPhone(data.phone);
        setLoc(data.loc);
        setDetails(data.details);
        setSections(data.sections);
        setSubmitted(true);
        navigate("/resumes");
        window.location.reload();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function onSubmit(evt) {
    evt.preventDefault();
  }

  return (
    <>
      <Form onSubmit={onSubmit} style={{ margin: "20px 50px" }}>
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
                value={resumeTitle || ""}
                required
                onChange={onChangeResumeTitle}
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
          <Col md={5}>
            <Form.Group controlId="formGridName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                required
                value={name || ""}
                onChange={onChangeName}
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group
              controlId="formFile"
              className="d-flex justify-content-center text-center mt-1"
            >
              {photo ? (
                <img
                  className="photo"
                  src={photo}
                  value={photo || ""}
                  alt=""
                  style={{
                    borderRadius: "50%",
                    maxHeight: "100px",
                    height: "auto",
                    width: "100px",
                    cursor: "pointer",
                    display: "block",
                  }}
                  onClick={() => {
                    document.querySelector(".photoUpload").click();
                  }}
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="80"
                  height="80"
                  fill="currentColor"
                  className="bi bi-person-circle"
                  viewBox="0 0 16 16"
                  style={{
                    cursor: "pointer",
                    color: "lightgray",
                    display: "block",
                  }}
                  onClick={() => {
                    document.querySelector(".photoUpload").click();
                  }}
                >
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  <path
                    fillRule="evenodd"
                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                  />
                </svg>
              )}
              <input
                className="photoUpload"
                type="file"
                label="Image"
                name="myFile"
                accept=".jpeg, .png, .jpg"
                style={{ display: "none" }}
                onChange={(e) => onChangePhoto(e)}
              />
              {/* <div className="photoInput">
                  <FileBase64
                    type="file"
                    multiple={false}
                    onDone={({ base64 }) => onChangePhoto(base64)}
                  />
                </div> */}
            </Form.Group>
          </Col>
          <Col md={5}>
            <Form.Group controlId="formGridJobTitle">
              <Form.Label>Job Title</Form.Label>
              <Form.Control
                type="text"
                value={title || ""}
                onChange={onChangeTitle}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              value={email || ""}
              onChange={onChangeEmail}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPhone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              value={phone || ""}
              onChange={onChangePhone}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridLoc">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              value={loc || ""}
              onChange={onChangeLoc}
            />
          </Form.Group>
        </Row>
        {details.map((element, index) => (
          <div key={index}>
            <Row className="mb-3">
              <Col>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={details[index].name || ""}
                  onChange={(e) => onChangeDetail(index, e)}
                />
              </Col>
              <Col>
                <Form.Control
                  type="text"
                  name="value"
                  placeholder="Value"
                  value={details[index].value || ""}
                  onChange={(e) => onChangeDetail(index, e)}
                />
              </Col>
              <Col>
                <Button
                  variant="danger"
                  type="button"
                  className="button remove"
                  onClick={() => removeDetail(index)}
                >
                  Remove
                </Button>
              </Col>
            </Row>
          </div>
        ))}
        <div className="add-detail">
          <Button
            variant="outline-success"
            className="mb-3"
            type="button"
            onClick={addDetail}
          >
            Add additional details
          </Button>
        </div>
        <hr />

        {sections.map((element, index) => (
          <div key={index}>
            <Row className="mb-3">
              <Col>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Section Name"
                  // value={element.name || ""}
                  value={sections[index].name || ""}
                  onChange={(e) => onChangeSectionName(index, e)}
                />
              </Col>
              {/* <Col>
                  <Form.Control
                    type="text"
                    name="value"
                    placeholder="Value"
                    value={element.value || ""}
                    onChange={(e) => onChangeDetail(index, e)}
                  />
                </Col> */}
              <Col>
                <Button
                  variant="danger"
                  type="button"
                  className="button remove"
                  onClick={() => removeSection(index)}
                >
                  Remove
                </Button>
              </Col>
            </Row>
            {sections[index].data &&
              Object.keys(sections[index].data).map((key, dataIdx) =>
                sections[index].type === "entry" ? (
                  <div key={dataIdx}>
                    <div>
                      <Row className="mb-3">
                        <Form.Group as={Col}>
                          <Form.Label>
                            Job title, school, activity name, etc
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="title"
                            value={sections[index].data[dataIdx].title || ""}
                            onChange={(e) => onChangeEntry(index, dataIdx, e)}
                          />
                        </Form.Group>

                        <Form.Group as={Col}>
                          <Form.Label>
                            Employer, degree, organization, etc
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="detail"
                            value={sections[index].data[dataIdx].detail || ""}
                            onChange={(e) => onChangeEntry(index, dataIdx, e)}
                          />
                        </Form.Group>
                      </Row>
                      <Row className="mb-3">
                        <Col xs={3}>
                          <Form.Group as={Col}>
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                              type="date"
                              name="startDate"
                              value={
                                sections[index].data[dataIdx].startDate || ""
                              }
                              onChange={(e) => onChangeEntry(index, dataIdx, e)}
                            />
                          </Form.Group>
                        </Col>
                        <Col xs={3}>
                          <Form.Group as={Col}>
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                              type="date"
                              name="endDate"
                              value={
                                sections[index].data[dataIdx].endDate || ""
                              }
                              onChange={(e) => onChangeEntry(index, dataIdx, e)}
                            />
                          </Form.Group>
                        </Col>
                        <Form.Group as={Col}>
                          <Form.Label>Location</Form.Label>
                          <Form.Control
                            type="text"
                            name="location"
                            value={sections[index].data[dataIdx].location || ""}
                            onChange={(e) => onChangeEntry(index, dataIdx, e)}
                          />
                        </Form.Group>
                      </Row>
                      <Form.Label>Description</Form.Label>
                      <textarea
                        as={Col}
                        className="form-control mb-3"
                        rows="3"
                        name="description"
                        value={sections[index].data[dataIdx].description || ""}
                        onChange={(e) => onChangeEntry(index, dataIdx, e)}
                      ></textarea>
                    </div>
                    <div className="col">
                      <Button
                        className="mb-3"
                        style={{
                          display: "inline-block",
                        }}
                        variant="outline-danger"
                        onClick={() => removeItem(index, dataIdx)}
                      >
                        -
                      </Button>
                      {dataIdx === sections[index].data.length - 1 && (
                        <Button
                          className="mb-3"
                          style={{
                            display: "inline-block",
                          }}
                          variant="outline-primary"
                          onClick={() => addItem(index, "entry")}
                        >
                          +
                        </Button>
                      )}
                    </div>
                  </div>
                ) : sections[index].type === "list" ? (
                  <div className="input-group mb-3 w-50" key={dataIdx}>
                    <div className="input-group-prepend">
                      <span className="input-group-text">&#8226;</span>
                    </div>
                    <Form.Control
                      type="text"
                      className="mb-3"
                      placeholder="Enter list item"
                      value={sections[index].data[dataIdx] || ""}
                      style={{
                        width: "20%",
                        minWidth: "300px",
                        display: "inline-block",
                      }}
                      onChange={(e) => onChangeList(index, dataIdx, e)}
                    ></Form.Control>
                    <div className="input-group-append">
                      <Button
                        style={{
                          display: "inline-block",
                        }}
                        variant="outline-danger"
                        onClick={() => removeItem(index, dataIdx)}
                      >
                        -
                      </Button>
                    </div>

                    {dataIdx === sections[index].data.length - 1 && (
                      <div className="input-group-append">
                        <Button
                          style={{
                            display: "inline-block",
                          }}
                          variant="outline-primary"
                          onClick={() => addItem(index, "list")}
                        >
                          +
                        </Button>
                      </div>
                    )}
                  </div>
                ) : sections[index].type === "tags" ? (
                  <div
                    className="input-group w-25"
                    key={dataIdx}
                    style={{ float: "left" }}
                  >
                    <Form.Control
                      type="text"
                      className="mb-3"
                      placeholder="Enter tag"
                      style={{
                        width: "10%",
                        minWidth: "100px",
                        display: "inline-block",
                      }}
                      value={sections[index].data[dataIdx] || ""}
                      onChange={(e) => onChangeList(index, dataIdx, e)}
                    ></Form.Control>
                    <div className="input-group-append">
                      <Button
                        style={{
                          display: "inline-block",
                        }}
                        variant="outline-danger"
                        onClick={() => removeItem(index, dataIdx)}
                      >
                        -
                      </Button>
                    </div>

                    {dataIdx === sections[index].data.length - 1 && (
                      <div className="input-group-append">
                        <Button
                          style={{
                            display: "inline-block",
                          }}
                          variant="outline-primary"
                          onClick={() => addItem(index, "tags")}
                        >
                          +
                        </Button>
                      </div>
                    )}
                  </div>
                ) : sections[index].type === "pair" ? (
                  <div className="input-group" key={dataIdx}>
                    <div className="row">
                      <div className="col">
                        <Form.Control
                          type="text"
                          className="mb-3"
                          placeholder="Enter name"
                          name="name"
                          aria-label="name"
                          style={{ width: "200px" }}
                          value={sections[index].data[dataIdx].name || ""}
                          onChange={(e) => onChangeEntry(index, dataIdx, e)}
                        ></Form.Control>
                      </div>
                      :
                      <div className="col">
                        <Form.Control
                          type="text"
                          className="mb-3"
                          placeholder="Enter value"
                          name="value"
                          aria-label="value"
                          style={{ width: "600px" }}
                          value={sections[index].data[dataIdx].value || ""}
                          onChange={(e) => onChangeEntry(index, dataIdx, e)}
                        ></Form.Control>
                      </div>
                      <div className="col">
                        <Button
                          className="mb-3"
                          style={{
                            display: "inline-block",
                          }}
                          variant="outline-danger"
                          onClick={() => removeItem(index, dataIdx)}
                        >
                          -
                        </Button>
                      </div>
                    </div>

                    {dataIdx === sections[index].data.length - 1 && (
                      <div className="input-group-append">
                        <Button
                          style={{
                            display: "inline-block",
                          }}
                          variant="outline-primary"
                          onClick={() => addItem(index, "pair")}
                        >
                          +
                        </Button>
                      </div>
                    )}
                  </div>
                ) : sections[index].type === "text" ? (
                  <div key={dataIdx}>
                    <textarea
                      className="form-control mb-3"
                      name="text"
                      rows="3"
                      placeholder="Enter text"
                      value={sections[index].data || ""}
                      onChange={(e) => onChangeText(index, e)}
                    ></textarea>
                    <Button
                      style={{
                        display: "inline-block",
                      }}
                      variant="outline-danger"
                      onClick={() => removeItem(index, dataIdx)}
                    >
                      -
                    </Button>
                  </div>
                ) : null
              )}

            {sections[index].data.length ? null : (
              <Row>
                <Col>
                  <DropdownButton
                    className="addItemBtn"
                    title="Add an item"
                    onSelect={(eventKey) => addItem(index, eventKey)}
                    variant="secondary"
                  >
                    <Dropdown.Item eventKey="entry">
                      Entry with Date, Loc, and Description
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="list">List</Dropdown.Item>
                    <Dropdown.Item eventKey="tags">
                      Collection of Tags
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="pair">
                      Name Value Pair
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="text">Text Field</Dropdown.Item>
                  </DropdownButton>
                </Col>
              </Row>
            )}
            <div style={{ clear: "left" }}>
              <hr />
            </div>
          </div>
        ))}

        <Row>
          <Button
            variant="outline-secondary"
            className="mb-3"
            size="lg"
            onClick={addSection}
          >
            Add Section
          </Button>
        </Row>
        <Row>
          <Button
            type="submit"
            onClick={saveResume}
            className="btn btn-success mb-3"
          >
            Save
          </Button>
        </Row>
      </Form>
    </>
  );
}
