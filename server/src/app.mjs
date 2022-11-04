import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import session from "express-session";
import "./db.mjs";
import * as auth from "./auth.mjs";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOptions = {
  origin: "http://localhost:3001",
};

const Resume = mongoose.model("Resume");

const loginMessages = {
  "PASSWORDS DO NOT MATCH": "Incorrect password",
  "USER NOT FOUND": "User doesn't exist",
};
const registrationMessages = {
  "USERNAME ALREADY EXISTS": "Username already exists",
  "USERNAME PASSWORD TOO SHORT": "Username or password is too short",
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//app.use(auth.authRequired(["/resume/all"]));

//app.set("view engine", "hbs");
// app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "this is top secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.use((req, res, next) => {
  console.log(req.method, req.path, JSON.stringify(req.body));
  next();
});

// Route Handlers

app.get("/", (req, res) => {
  //res.render("index");
  //res.json({ message: "Welcome to this app." });
  res.redirect("/resumes");
});

app.get("/resumes", (req, res) => {
  Resume.find({})
    .sort("-createdAt")
    .exec((err, resumes) => {
      res.json({
        user: req.session.user,
        resumes: resumes,
      });
    });
});

app.post("/resume/add", (req, res) => {
  const { resumeTitle, name, title, email, phone, loc } = req.body;
  const resume = new Resume({
    resumetitle: req.body.resumetitle,
    name: req.body.name,
    title: req.body.title,
    email: req.body.email,
    phone: req.body.phone,
    loc: req.body.loc,
  });
  resume.save((err, savedResume) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.json(savedResume);
    }
  });
});

app.get("/resume/:id", (req, res) => {
  const id = req.params.id;
  Resume.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found resume with id " + id });
      else res.json(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving resume with id " + id });
    });
});

app.post("/login", (req, res) => {
  // setup callbacks for register success and error
  function success(newUser) {
    auth.startAuthenticatedSession(req, newUser, (err) => {
      if (!err) {
        res.redirect("/");
      } else {
        res.json({ message: "Session error" });
      }
    });
  }

  function error(err) {
    res.json({
      message: registrationMessages[err.message] ?? "Registration error",
    });
  }

  // attempt to register new user
  auth.register(
    req.body.username,
    req.body.email,
    req.body.password,
    error,
    success
  );
});

app.post("/register", (req, res) => {
  // setup callbacks for login success and error
  function success(user) {
    auth.startAuthenticatedSession(req, user, (err) => {
      if (!err) {
        res.redirect("/");
      } else {
        res.json({ message: "error starting auth sess: " + err });
      }
    });
  }

  function error(err) {
    res.json({
      message: loginMessages[err.message] || "Login unsuccessful",
    });
  }

  // attempt to login
  auth.login(req.body.username, req.body.password, error, success);
});

app.listen(process.env.PORT || 3000);
