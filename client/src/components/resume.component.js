import React, { useState, useEffect } from "react";
import { getBaseURL } from "../http.js";
import { useNavigate, useParams } from "react-router-dom";

export default function Resume() {
  const [currentResume, setCurrentResume] = useState({
    id: null,
    resumetitle: "",
    name: "",
    title: "",
    photo: "",
    email: "",
    phone: "",
    loc: "",
    details: [],
    sections: [],
  });

  const navigate = useNavigate();
  const { username, id } = useParams();

  useEffect(() => {
    if (username !== undefined) getResumeByUsername(username);
    else if (!document.referrer) navigate("/");
    else getResumeById(id);

    function getResumeByUsername(username) {
      fetch(getBaseURL() + "/user/" + username, { mode: "cors" })
        .then((response) => {
          if (response.ok) return response.json();
          else throw new Error(response.statusText);
        })
        .then((data) => {
          // console.log(data);
          setCurrentResume(data.published);
          // console.log(data);
        })
        .catch((e) => {
          console.log(e);
          navigate("/network");
          window.location.reload();
        });
    }

    function getResumeById(id) {
      fetch(getBaseURL() + "/resume/" + id, { mode: "cors" })
        .then((response) => {
          if (response.ok) return response.json();
          else throw new Error(response.statusText);
        })
        .then((data) => {
          setCurrentResume(data);
          // console.log(data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [id, navigate, username]);

  return (
    <>
      <div style={{ marginTop: "20px", marginLeft: "50px" }}>
        <h1 style={{ fontWeight: "bold", display: "inline-block" }}>
          {currentResume.name}
        </h1>{" "}
        {currentResume.photo && (
          <img
            className="photo"
            src={currentResume.photo}
            width="80"
            height="80"
            alt=""
            style={{
              borderRadius: "50%",
              maxHeight: "200px",
              margin: "10px",
              position: "relative",
              top: "-10px",

              // cursor: "pointer",
              display: "inline-block",
            }}
          />
        )}
        <div
          style={{
            marginRight: "50px",
            height: "10px",
            backgroundColor: "lightgray",
            color: "black",
          }}
        ></div>
        {currentResume.title ? (
          <div
            style={{
              backgroundColor: "lightgray",
              height: "40px",
              textAlign: "center",
              maxWidth: "max-content",
              padding: "5px 10px",
              fontSize: "20px",
              color: "white",
              position: "relative",
              // right: "70px",
              // right: "70px",
              // top: "140px",
              fontWeight: "bold",
              display: "inline-block",
            }}
          >
            {currentResume.title}
          </div>
        ) : null}
        <div
          className="resumeContent"
          style={{ position: "relative", top: "30px" }}
        >
          <h4>Contact</h4>
          <div style={{ float: "left" }}>
            {currentResume.email && (
              <div className="mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-envelope"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                </svg>{" "}
                <a href={`mailto: ${currentResume.email}`}>
                  {currentResume.email}
                </a>
              </div>
            )}
            {currentResume.phone && (
              <div className="mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-telephone"
                  viewBox="0 0 16 16"
                >
                  <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
                </svg>{" "}
                {currentResume.phone}
              </div>
            )}
            {currentResume.loc && (
              <div className="mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-geo-alt"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
                  <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                </svg>{" "}
                {currentResume.loc}
              </div>
            )}
          </div>
          <div style={{ float: "left", marginLeft: "50px" }}>
            {currentResume.details.slice(0, 3).map((val, index) => (
              <div className="mb-2" key={index}>
                {val.name}: {val.value}
              </div>
            ))}
          </div>
          <div style={{ float: "left", marginLeft: "50px" }}>
            {currentResume.details.slice(3, 6).map((val, index) => (
              <div className="mb-2" key={index}>
                {val.name}: {val.value}
              </div>
            ))}
          </div>
          <div style={{ float: "left", marginLeft: "50px" }}>
            {currentResume.details.slice(6, 9).map((val, index) => (
              <div className="mb-2" key={index}>
                {val.name}: {val.value}
              </div>
            ))}
          </div>
          <div style={{ clear: "both", marginBottom: "10px" }}></div>

          {currentResume.sections.map((obj, index) => {
            return (
              <div key={index} style={{ marginBottom: "20px" }}>
                <h4 className="mb-2">{obj.name}</h4>

                {obj.type === "entry" &&
                  obj.data.map((ele, i) => {
                    return (
                      <div key={i} style={{ marginBottom: "5px" }}>
                        {ele.title && (
                          <span
                            style={{
                              display: "inline-block",
                              fontSize: "20px",
                            }}
                          >
                            {ele.title}
                          </span>
                        )}
                        {ele.detail && (
                          <span style={{ color: "gray" }}>
                            &nbsp;|&nbsp;{ele.detail}
                          </span>
                        )}
                        <br />
                        {ele.startDate && (
                          <span
                            style={{ color: "gray", display: "inline-block" }}
                          >
                            {ele.startDate}
                          </span>
                        )}
                        {ele.endDate ? (
                          <span
                            style={{ color: "gray", display: "inline-block" }}
                          >
                            &nbsp;~&nbsp;{ele.endDate}
                          </span>
                        ) : (
                          <span
                            style={{ color: "gray", display: "inline-block" }}
                          >
                            &nbsp;~&nbsp;Present
                          </span>
                        )}
                        {ele.location && (
                          <span
                            style={{ color: "gray", display: "inline-block" }}
                          >
                            &nbsp;|&nbsp;{ele.location}
                          </span>
                        )}
                        {ele.description && (
                          <div style={{ color: "gray" }}>{ele.description}</div>
                        )}
                      </div>
                    );
                  })}
                {obj.type === "list" && (
                  <ul>
                    {obj.data.map((ele, i) => {
                      return <li key={i}>{ele}</li>;
                    })}
                  </ul>
                )}
                {obj.type === "tags" &&
                  obj.data.map((ele, i) => {
                    return (
                      <span
                        style={{
                          background: "lightgray",
                          padding: "3px",
                          borderRadius: "5px",
                          margin: "2px",
                        }}
                        key={i}
                      >
                        {ele}
                      </span>
                    );
                  })}
                {obj.type === "pair" &&
                  obj.data.map((ele, i) => {
                    return (
                      <div key={i}>
                        {ele.name}: {ele.value}
                      </div>
                    );
                  })}

                {obj.type === "text" && <div>{obj.data}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
