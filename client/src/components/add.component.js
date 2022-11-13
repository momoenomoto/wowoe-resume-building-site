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
    //this.onChangeLastEdited = this.onChangeLastEdited.bind(this);
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
    };
  }

  componentDidMount() {
    const currentUser = getCurrentUser();

    if (!currentUser) this.setState({ redirect: "/" });
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
      sections: [...this.state.sections, { name: "" }],
    });
  }

  removeSection(i) {
    this.state.sections.splice(i, 1);
    this.setState({ sections: this.state.sections });
  }

  onChangeSectionName(i, e) {
    const temp = [...this.state.sections];
    temp[i] = { ...temp[i], name: e.target.value };
    this.setState({ sections: temp });
  }

  addItem(i, eventKey) {
    const temp = [...this.state.sections];
    temp[i] = { ...temp[i], items: [{ type: eventKey }] };

    // this.state.sections[i]["items"]["type"] = eventKey;
    // console.log(this.state.sections[i]["subsection"]["type"]);
    this.setState({ sections: temp });
  }

  saveResume() {
    const data = {
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
                <Form.Control type="text" onChange={this.onChangeTitle} />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="text" onChange={this.onChangeEmail} />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridPhone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="text" onChange={this.onChangePhone} />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridLoc">
              <Form.Label>Location</Form.Label>
              <Form.Control type="text" onChange={this.onChangeLoc} />
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
                    // value={element.name || ""}
                    onChange={(e) => this.onChangeDetail(index, e)}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    name="value"
                    placeholder="Value"
                    // value={element.value || ""}
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
              <Row>
                <Col>
                  <DropdownButton
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
                  {/*     
                  <Form.Select
                    aria-label="type"
                    onChange={(e) => this.onChangeSubsectionType(index, e)}
                  >
                    <option value="">Choose a type for your subsection</option>
                    <option value="entry">
                      Entry with Date, Loc, and Description
                    </option>
                    <option value="list"> + List</option>
                    <option value="tags"> + Collection of Tags</option>
                    <option value="pair"> + Name Value Pair</option>
                    <option value="text"> + Text Field</option>
                  </Form.Select> */}
                </Col>
              </Row>
              <hr />
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
              className="btn btn-success"
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
