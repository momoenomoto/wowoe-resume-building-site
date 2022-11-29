import React, { useState, useEffect } from "react";
import { getBaseURL, getCurrentUser } from "../http.js";
import icon from "../img/resume_icon.jpg";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export default function AllResumes() {
  const [resumes, setResumes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [search, setSearch] = useState("");
  const [publishedResumeId, setPublishedResumeId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser) navigate("/");
    else {
      retrieveResumes();
    }

    function retrieveResumes() {
      fetch(getBaseURL() + "/resumes", {
        mode: "cors",
        headers: new Headers({ user: JSON.stringify(getCurrentUser()) }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else throw new Error(response.statusText);
        })
        .then((data) => {
          setResumes(data.resumes);
          setPublishedResumeId(data.published);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [navigate]);

  function onChangeSearch(e) {
    const search = e.target.value;

    setSearch(search);
  }

  function setActiveResume(resume, index) {
    setCurrentIndex(index);
  }

  function setPublishedResume(resume) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", mode: "cors" },
      body: JSON.stringify({
        published: resume._id,
        user: getCurrentUser(),
      }),
    };

    fetch(getBaseURL() + "/resumes", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else throw new Error(response.statusText);
      })
      .then((data) => {
        setPublishedResumeId(resume._id);
        // console.log(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function unsetPublishedResume() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", mode: "cors" },
      body: JSON.stringify({
        published: undefined,
        user: getCurrentUser(),
      }),
    };

    fetch(getBaseURL() + "/resumes", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else throw new Error(response.statusText);
      })
      .then((data) => {
        setPublishedResumeId(null);
        // console.log(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function removeResume(resumeId) {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json", mode: "cors" },
      body: JSON.stringify({
        resumeId,
        user: getCurrentUser(),
      }),
    };

    fetch(getBaseURL() + "/resumes", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else throw new Error(response.statusText);
      })
      .then((data) => {
        setPublishedResumeId(data.published);
        window.location.reload();
        // console.log(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function searchName() {
    fetch(getBaseURL() + `/resumes?resumetitle=${search}`, {
      mode: "cors",
      headers: new Headers({ user: JSON.stringify(getCurrentUser()) }),
    })
      .then((response) => {
        if (response.ok) return response.json();
        else throw new Error(response.statusText);
      })
      .then((data) => {
        setResumes(data.resumes);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return (
    <>
      <div style={{ margin: "20px 50px" }}>
        <div className="row">
          <div className="col-sm-2 col-12">
            <h2>My Resumes</h2>
          </div>
          <div className="col-md-3 col-12">
            <div className="input-group mb-3" style={{ width: "300px" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search by resume title"
                value={search}
                onChange={onChangeSearch}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={searchName}
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

        <div className="row">
          <div className="col">
            <a href="/resume/add">
              <button type="button" className="btn btn-outline-secondary mb-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-plus-square-dotted"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"></path>
                </svg>
                Create New Resume
              </button>
            </a>
          </div>
        </div>
        <div className="resume-content">
          {resumes
            ? resumes.map((resume, index) => (
                <div className="resume d-inline-block" key={index}>
                  <figure
                    className={
                      "me-5 mb-5 group-item " +
                      (index === currentIndex ? "selected" : "")
                    }
                    key={index}
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => setActiveResume(resume, index)}
                  >
                    <img
                      className="block"
                      alt="icon"
                      src={icon}
                      width="200"
                      height="200"
                    />
                    <figcaption
                      className="resumeTitle text-center"
                      style={{
                        position: "absolute",
                        width: "100%",
                        marginTop: "-10px",
                      }}
                    >
                      {resume.resumetitle}
                    </figcaption>
                    <div
                      className="resumeDate text-center"
                      style={{
                        position: "relative",
                        width: "100%",
                        top: "20px",
                        fontSize: "small",
                        marginBottom: "40px",
                        // margin: "10px",
                      }}
                    >
                      Updated{" "}
                      {resume.createdAt.substr(
                        0,
                        resume.createdAt.indexOf("T")
                      )}
                    </div>
                  </figure>
                  {publishedResumeId === resume._id ? (
                    <div
                      className="text-center"
                      style={{
                        position: "absolute",
                        // textAlign: "center",
                        marginLeft: "27px",

                        color: "red",
                        marginTop: "-240px",
                        fontWeight: "bold",
                        transform: "rotate(-45deg)",
                        fontSize: "2em",
                      }}
                    >
                      Published
                    </div>
                  ) : null}
                  {index === currentIndex ? (
                    <div
                      className="resumeButtons text-center"
                      style={{
                        position: "absolute",
                        marginLeft: "15px",
                        marginTop: "-40px",
                      }}
                    >
                      <Button
                        href={"/resume/" + resume._id}
                        variant="info"
                        size="sm"
                      >
                        View
                      </Button>{" "}
                      <Button
                        href={"/resume/edit/" + resume._id}
                        variant="warning"
                        size="sm"
                      >
                        Edit
                      </Button>{" "}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeResume(resume._id)}
                      >
                        Remove
                      </Button>{" "}
                      <div
                        className="publishBtn text-center"
                        style={{
                          position: "absolute",
                          marginLeft: "40px",
                          marginTop: "-340px",
                        }}
                      >
                        {publishedResumeId === resume._id ? (
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="flexSwitchCheckChecked"
                              role="switch"
                              onChange={() => unsetPublishedResume()}
                              checked
                            />
                            <label
                              className="form-check-label"
                              htmlFor="flexSwitchCheckChecked"
                            >
                              Publish
                            </label>
                          </div>
                        ) : (
                          <Form>
                            <Form.Check
                              type="switch"
                              id="custom-switch"
                              label="Publish"
                              onChange={() => setPublishedResume(resume)}
                              // checked
                            />
                          </Form>
                        )}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ))
            : ""}
        </div>
      </div>
    </>
  );
}
