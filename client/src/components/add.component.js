import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Button from "react-bootstrap/Button";
import { getBaseURL, getCurrentUser } from "../http.js";
import { withRouter } from "../with-router";
import { Navigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
// import FileBase64 from "react-file-base64";

class Add extends Component {
  constructor(props) {
    super(props);
    this.onChangeResumeTitle = this.onChangeResumeTitle.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangePhoto = this.onChangePhoto.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePhone = this.onChangePhone.bind(this);
    this.onChangeLoc = this.onChangeLoc.bind(this);
    this.onChangeDetail = this.onChangeDetail.bind(this);
    this.addDetail = this.addDetail.bind(this);
    this.removeDetail = this.removeDetail.bind(this);
    this.addSection = this.addSection.bind(this);
    this.removeSection = this.removeSection.bind(this);
    this.onChangeSectionName = this.onChangeSectionName.bind(this);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onChangeList = this.onChangeList.bind(this);
    this.onChangeEntry = this.onChangeEntry.bind(this);
    this.saveResume = this.saveResume.bind(this);

    this.state = {
      resumetitle: "",
      name: "",
      title: "",
      photo: "",
      email: "",
      phone: "",
      loc: "",
      details: [],
      sections: [],
      //published: false,
      submitted: false,
      redirect: false,
      addMode: true,
    };
  }

  componentDidMount() {
    const currentUser = getCurrentUser();

    if (!currentUser) this.setState({ redirect: "/" });
    else if (this.props.router.params.id !== undefined) {
      this.getResumeById(this.props.router.params.id);
      this.state.addMode = false;
    }
  }

  getResumeById(id) {
    fetch(getBaseURL() + "/resume/" + id, { mode: "cors" })
      .then((response) => {
        if (response.ok) return response.json();
        else throw new Error(response.statusText);
      })
      .then((data) => {
        this.setState({
          resumetitle: data.resumetitle,
          name: data.name,
          title: data.title,
          photo: data.photo,
          email: data.email,
          phone: data.phone,
          loc: data.loc,
          details: data.details,
          sections: data.sections,
        });
        // console.log(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  convertToBase64(file) {
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

  async onChangePhoto(e) {
    const file = e.target.files[0];
    const base64 = await this.convertToBase64(file);

    this.setState({
      photo: base64,
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
    this.setState({
      details: [...this.state.details, { name: "", value: "" }],
    });
    this.detailId++;
  }

  removeDetail(i) {
    this.state.details.splice(i, 1);
    this.setState({ details: this.state.details });
  }

  onChangeDetail(i, e) {
    const temp = [...this.state.details];
    temp[i] = { ...temp[i], [e.target.name]: e.target.value };
    this.setState({ details: temp });
  }

  addSection() {
    this.setState({
      sections: [...this.state.sections, { name: "", data: [] }],
    });
  }

  removeSection(sectionIdx) {
    // const temp = [...this.state.sections];
    // temp.splice(i, 1);
    // this.setState({ sections: temp });

    this.setState({
      sections: this.state.sections.filter((_, i) => i !== sectionIdx),
    });
    // console.log(this.state.sections);
  }

  onChangeSectionName(i, e) {
    const temp = [...this.state.sections];
    temp[i] = { ...temp[i], name: e.target.value };
    this.setState({ sections: temp });
  }

  addItem(sectionIdx, eventKey) {
    // console.log(eventKey);

    const buttons = document.querySelectorAll(".addItemBtn");
    for (let i = 0; i < buttons.length; i++) buttons[i].style.display = "none";

    this.setState((prevState) => {
      const temp = {
        ...prevState,
        sections: [...prevState.sections],
      };

      if (temp.sections[sectionIdx].data === undefined) {
        temp.sections[sectionIdx] = {
          ...temp.sections[sectionIdx],
          type: eventKey,
          data: [""],
        };
      } else {
        temp.sections[sectionIdx] = {
          ...temp.sections[sectionIdx],
          type: eventKey,
          data: [...temp.sections[sectionIdx].data, ""],
        };
      }

      // console.log(temp);

      return temp;
    });
  }

  removeItem(sectionIdx, dataIdx) {
    if (this.state.sections[sectionIdx].data.length === 1) {
      document.querySelector(".addItemBtn").style.display = "inline-block";
    }
    this.state.sections[sectionIdx].data.splice(dataIdx, 1);
    this.setState({ sections: this.state.sections });
  }

  onChangeText(sectionIdx, e) {
    this.setState((prevState) => {
      const temp = {
        ...prevState,
        sections: [...prevState.sections],
      };

      temp.sections[sectionIdx].data = [e.target.value];

      // temp.sections[sectionIdx].items.data[dataIdx] = ""
      //   ...temp.sections[sectionIdx].item.data[data],
      //   data: e.target.value,
      // ];

      return temp;
    });
    // console.log(this.sections[sectionIdx].items[itemIdx]);
  }

  onChangeList(sectionIdx, dataIdx, e) {
    this.setState((prevState) => {
      const temp = {
        ...prevState,
        sections: [...prevState.sections],
      };
      temp.sections[sectionIdx].data = [...temp.sections[sectionIdx].data];
      temp.sections[sectionIdx].data[dataIdx] = e.target.value;

      return temp;
    });
  }

  onChangeEntry(sectionIdx, dataIdx, e) {
    this.setState((prevState) => {
      const temp = {
        ...prevState,
        sections: [...prevState.sections],
      };
      temp.sections[sectionIdx].data = [...temp.sections[sectionIdx].data];
      temp.sections[sectionIdx].data[dataIdx] = {
        ...temp.sections[sectionIdx].data[dataIdx],
        [e.target.name]: e.target.value,
      };

      return temp;
    });
  }

  saveResume() {
    let data;
    if (this.state.addMode) {
      data = {
        resumetitle: this.state.resumetitle,
        name: this.state.name,
        title: this.state.title,
        photo: this.state.photo,
        email: this.state.email,
        phone: this.state.phone,
        loc: this.state.loc,
        details: this.state.details,
        sections: this.state.sections,
        user: getCurrentUser(),
      };
    } else {
      data = {
        id: this.props.router.params.id,
        resumetitle: this.state.resumetitle,
        name: this.state.name,
        title: this.state.title,
        photo: this.state.photo,
        email: this.state.email,
        phone: this.state.phone,
        loc: this.state.loc,
        details: this.state.details,
        sections: this.state.sections,
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
        this.setState({
          resumetitle: data.resumetitle,
          name: data.name,
          title: data.title,
          photo: data.photo,
          email: data.email,
          phone: data.phone,
          loc: data.loc,
          details: data.details,
          sections: data.sections,
          //published: response.data.published,
          submitted: true,
        });
        this.props.router.navigate("/resumes");
        window.location.reload();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  onSubmit = (evt) => {
    evt.preventDefault();
  };

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />;
    }
    return (
      <>
        <Form onSubmit={this.onSubmit}>
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
                  value={this.state.resumetitle || ""}
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
            <Col md={5}>
              <Form.Group controlId="formGridName">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={this.state.name || ""}
                  onChange={this.onChangeName}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group
                controlId="formFile"
                className="d-flex justify-content-center text-center mt-1"
              >
                {this.state.photo ? (
                  <img
                    className="photo"
                    src={this.state.photo}
                    value={this.state.photo || ""}
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
                  onChange={(e) => this.onChangePhoto(e)}
                />
                {/* <div className="photoInput">
                  <FileBase64
                    type="file"
                    multiple={false}
                    onDone={({ base64 }) => this.onChangePhoto(base64)}
                  />
                </div> */}
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group controlId="formGridJobTitle">
                <Form.Label>Job Title</Form.Label>
                <Form.Control
                  type="text"
                  value={this.state.title || ""}
                  onChange={this.onChangeTitle}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                value={this.state.email || ""}
                onChange={this.onChangeEmail}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridPhone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                value={this.state.phone || ""}
                onChange={this.onChangePhone}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridLoc">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={this.state.loc || ""}
                onChange={this.onChangeLoc}
              />
            </Form.Group>
          </Row>
          {this.state.details.map((element, index) => (
            <div key={index}>
              <Row className="mb-3">
                <Col>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={this.state.details[index].name || ""}
                    onChange={(e) => this.onChangeDetail(index, e)}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    name="value"
                    placeholder="Value"
                    value={this.state.details[index].value || ""}
                    onChange={(e) => this.onChangeDetail(index, e)}
                  />
                </Col>
                <Col>
                  <Button
                    variant="danger"
                    type="button"
                    className="button remove"
                    onClick={() => this.removeDetail(index)}
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
              onClick={this.addDetail}
            >
              Add additional details
            </Button>
          </div>
          <hr />

          {this.state.sections.map((element, index) => (
            <div key={index}>
              <Row className="mb-3">
                <Col>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Section Name"
                    // value={element.name || ""}
                    value={this.state.sections[index].name || ""}
                    onChange={(e) => this.onChangeSectionName(index, e)}
                  />
                </Col>
                {/* <Col>
                  <Form.Control
                    type="text"
                    name="value"
                    placeholder="Value"
                    value={element.value || ""}
                    onChange={(e) => this.onChangeDetail(index, e)}
                  />
                </Col> */}
                <Col>
                  <Button
                    variant="danger"
                    type="button"
                    className="button remove"
                    onClick={() => this.removeSection(index)}
                  >
                    Remove
                  </Button>
                </Col>
              </Row>
              {this.state.sections[index].data &&
                Object.keys(this.state.sections[index].data).map(
                  (key, dataIdx) =>
                    this.state.sections[index].type === "entry" ? (
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
                                value={
                                  this.state.sections[index].data[dataIdx]
                                    .title || ""
                                }
                                onChange={(e) =>
                                  this.onChangeEntry(index, dataIdx, e)
                                }
                              />
                            </Form.Group>

                            <Form.Group as={Col}>
                              <Form.Label>
                                Employer, degree, organization, etc
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="detail"
                                value={
                                  this.state.sections[index].data[dataIdx]
                                    .detail || ""
                                }
                                onChange={(e) =>
                                  this.onChangeEntry(index, dataIdx, e)
                                }
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
                                    this.state.sections[index].data[dataIdx]
                                      .startDate || ""
                                  }
                                  onChange={(e) =>
                                    this.onChangeEntry(index, dataIdx, e)
                                  }
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
                                    this.state.sections[index].data[dataIdx]
                                      .endDate || ""
                                  }
                                  onChange={(e) =>
                                    this.onChangeEntry(index, dataIdx, e)
                                  }
                                />
                              </Form.Group>
                            </Col>
                            <Form.Group as={Col}>
                              <Form.Label>Location</Form.Label>
                              <Form.Control
                                type="text"
                                name="location"
                                value={
                                  this.state.sections[index].data[dataIdx]
                                    .location || ""
                                }
                                onChange={(e) =>
                                  this.onChangeEntry(index, dataIdx, e)
                                }
                              />
                            </Form.Group>
                          </Row>
                          <Form.Label>Description</Form.Label>
                          <textarea
                            as={Col}
                            className="form-control mb-3"
                            rows="3"
                            name="description"
                            value={
                              this.state.sections[index].data[dataIdx]
                                .description || ""
                            }
                            onChange={(e) =>
                              this.onChangeEntry(index, dataIdx, e)
                            }
                          ></textarea>
                        </div>
                        <div className="col">
                          <Button
                            className="mb-3"
                            style={{
                              display: "inline-block",
                            }}
                            variant="outline-danger"
                            onClick={() => this.removeItem(index, dataIdx)}
                          >
                            -
                          </Button>
                          {dataIdx ===
                            this.state.sections[index].data.length - 1 && (
                            <Button
                              className="mb-3"
                              style={{
                                display: "inline-block",
                              }}
                              variant="outline-primary"
                              onClick={() => this.addItem(index, "entry")}
                            >
                              +
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : this.state.sections[index].type === "list" ? (
                      <div className="input-group mb-3 w-50" key={dataIdx}>
                        <div className="input-group-prepend">
                          <span className="input-group-text">&#8226;</span>
                        </div>
                        <Form.Control
                          type="text"
                          className="mb-3"
                          placeholder="Enter list item"
                          value={this.state.sections[index].data[dataIdx] || ""}
                          style={{
                            width: "20%",
                            minWidth: "300px",
                            display: "inline-block",
                          }}
                          onChange={(e) => this.onChangeList(index, dataIdx, e)}
                        ></Form.Control>
                        <div className="input-group-append">
                          <Button
                            style={{
                              display: "inline-block",
                            }}
                            variant="outline-danger"
                            onClick={() => this.removeItem(index, dataIdx)}
                          >
                            -
                          </Button>
                        </div>

                        {dataIdx ===
                          this.state.sections[index].data.length - 1 && (
                          <div className="input-group-append">
                            <Button
                              style={{
                                display: "inline-block",
                              }}
                              variant="outline-primary"
                              onClick={() => this.addItem(index, "list")}
                            >
                              +
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : this.state.sections[index].type === "tags" ? (
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
                          value={this.state.sections[index].data[dataIdx] || ""}
                          onChange={(e) => this.onChangeList(index, dataIdx, e)}
                        ></Form.Control>
                        <div className="input-group-append">
                          <Button
                            style={{
                              display: "inline-block",
                            }}
                            variant="outline-danger"
                            onClick={() => this.removeItem(index, dataIdx)}
                          >
                            -
                          </Button>
                        </div>

                        {dataIdx ===
                          this.state.sections[index].data.length - 1 && (
                          <div className="input-group-append">
                            <Button
                              style={{
                                display: "inline-block",
                              }}
                              variant="outline-primary"
                              onClick={() => this.addItem(index, "tags")}
                            >
                              +
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : this.state.sections[index].type === "pair" ? (
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
                              value={
                                this.state.sections[index].data[dataIdx].name ||
                                ""
                              }
                              onChange={(e) =>
                                this.onChangeEntry(index, dataIdx, e)
                              }
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
                              value={
                                this.state.sections[index].data[dataIdx]
                                  .value || ""
                              }
                              onChange={(e) =>
                                this.onChangeEntry(index, dataIdx, e)
                              }
                            ></Form.Control>
                          </div>
                          <div className="col">
                            <Button
                              className="mb-3"
                              style={{
                                display: "inline-block",
                              }}
                              variant="outline-danger"
                              onClick={() => this.removeItem(index, dataIdx)}
                            >
                              -
                            </Button>
                          </div>
                        </div>

                        {dataIdx ===
                          this.state.sections[index].data.length - 1 && (
                          <div className="input-group-append">
                            <Button
                              style={{
                                display: "inline-block",
                              }}
                              variant="outline-primary"
                              onClick={() => this.addItem(index, "pair")}
                            >
                              +
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : this.state.sections[index].type === "text" ? (
                      <div key={dataIdx}>
                        <textarea
                          className="form-control mb-3"
                          name="text"
                          rows="3"
                          placeholder="Enter text"
                          value={this.state.sections[index].data || ""}
                          onChange={(e) => this.onChangeText(index, e)}
                        ></textarea>
                        <Button
                          style={{
                            display: "inline-block",
                          }}
                          variant="outline-danger"
                          onClick={() => this.removeItem(index, dataIdx)}
                        >
                          -
                        </Button>
                      </div>
                    ) : null
                )}

              {this.state.sections[index].data.length ? null : (
                <Row>
                  <Col>
                    <DropdownButton
                      className="addItemBtn"
                      title="Add an item"
                      onSelect={(eventKey) => this.addItem(index, eventKey)}
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
              onClick={this.addSection}
            >
              Add Section
            </Button>
          </Row>
          <Row>
            <Button
              type="submit"
              onClick={this.saveResume}
              className="btn btn-success mb-3"
            >
              Save
            </Button>
          </Row>
        </Form>
      </>
    );
  }
}

export default withRouter(Add);
