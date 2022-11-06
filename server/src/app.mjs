import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import session from "express-session";
import "./db.mjs";
import * as auth from "./auth.mjs";
import * as dotenv from "dotenv";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: __dirname + "/../.env" });

const corsOptions = {
  origin:
    process.env.NODE_ENV === "PRODUCTION"
      ? "http://linserv1.cims.nyu.edu/29901"
      : "http://localhost:3001",
  credentials: true,
};

const Resume = mongoose.model("Resume");

const loginMessages = {
  "PASSWORDS DO NOT MATCH": "Incorrect username or password",
  "USER NOT FOUND": "Incorrect username or password",
};
const registrationMessages = {
  "USERNAME ALREADY EXISTS": "Username already exists",
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//app.set("view engine", "hbs");
// app.use(express.static(path.join(__dirname, "public")));
// app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// app.use(auth.authRequired(["/resumes", "/resume/add"]));

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
  res.json({ message: "Welcome to Wowoe" });
});

app.get("/resumes", (req, res) => {
  const resumetitle = req.query.resumetitle ?? "";
  if (resumetitle === "") {
    Resume.find({})
      .sort("-updatedAt")
      .exec((err, resumes) => {
        // console.log(req.session.user);
        res.json({
          // user: req.session.user,
          resumes: resumes,
        });
      });
  } else {
    Resume.find({ resumetitle: { $regex: resumetitle, $options: "i" } })
      .sort("-updatedAt")
      .exec((err, resumes) => {
        res.json({
          // user: req.session.user,
          resumes: resumes,
        });
      });
  }
});

app.post("/resume/add", (req, res) => {
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
      console.log(savedResume);
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

app.post("/register", (req, res) => {
  // setup callbacks for register success and error
  function success(newUser) {
    auth.startAuthenticatedSession(req, newUser, (err) => {
      if (!err) {
        res.json({ user: req.session.user });
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

app.post("/login", (req, res) => {
  // setup callbacks for login success and error
  function success(user) {
    auth.startAuthenticatedSession(req, user, (err) => {
      if (err) {
        res.json({ message: "error starting auth sess: " + err });
      } else {
        console.log(req.session.user);
        res.json({ user: req.session.user });
        // res.redirect("/");
      }
    });
  }

  function error(err) {
    console.log(err);
    res.json({
      message: loginMessages[err.message] || "Login unsuccessful",
    });
  }

  // attempt to login
  auth.login(req.body.username, req.body.password, error, success);
});

app.post("/logout", (req, res) => {
  auth.endAuthenticatedSession(req, (err) => {
    if (err) {
      res.json({ message: "error ending auth sess: " + err });
    } else {
      res.redirect("/");
    }
  });
});

app.listen(process.env.PORT || 3000);
