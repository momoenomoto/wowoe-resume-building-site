import express from "express";
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
  origin: true,
  credentials: true,
};

const Resume = mongoose.model("Resume");
const User = mongoose.model("User");

const loginMessages = {
  "PASSWORDS DO NOT MATCH": "Incorrect username or password",
  "USER NOT FOUND": "Incorrect username or password",
};
const registrationMessages = {
  "USERNAME ALREADY EXISTS": "Username already exists",
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));
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
  let user;
  try {
    user = JSON.parse(req.get("user"));
  } catch {
    res.status(403).json({
      message: "Forbidden access",
    });
    return;
  }
  if (resumetitle === "") {
    User.findOne({ username: user.username })

      .populate({ path: "resumes", options: { sort: { updatedAt: -1 } } })
      // .populate({
      //   path: "resumes",
      //   // sort: { updatedAt: 1 },
      // })
      .exec((err, user) => {
        // console.log(resumes);
        if (err)
          res.status(500).json({
            message: err.message,
          });
        // console.log(req.session.user);
        else
          res.json({
            // user: req.session.user,
            published: user.published,
            resumes: user.resumes,
          });
      });
  } else {
    User.findOne({ username: user.username }).exec((err, user) => {
      if (err)
        res.status(500).json({
          message: err.message,
        });
      else {
        Resume.find({
          user: mongoose.Types.ObjectId(user._id),
          resumetitle: { $regex: resumetitle, $options: "i" },
        })
          .sort("-updatedAt")
          .exec((err, resumes) => {
            console.log(resumes);
            res.json({
              published: user.published,
              // user: req.session.user,
              resumes: resumes,
            });
          });
      }
    });
  }
});

app.post("/resumes", (req, res) => {
  if (req.body.published !== undefined) {
    User.findOneAndUpdate(
      { username: req.body.user.username },
      { published: mongoose.Types.ObjectId(req.body.published) },
      function (err) {
        if (err) {
          res.status(500).json({
            message: err.message,
          });
        } else {
          // console.log(savedResume);
          res.status(200).json({ message: "success" });
        }
      }
    );
  } else {
    User.findOneAndUpdate(
      { username: req.body.user.username },
      { published: null },
      function (err) {
        if (err) {
          res.status(500).json({
            message: err.message,
          });
        } else {
          // console.log(savedResume);
          res.status(200).json({ message: "success" });
        }
      }
    );
  }
});

app.delete("/resumes", (req, res) => {
  User.findOne({ username: req.body.user.username }, (err, user) => {
    if (err) {
      res.status(500).json({
        message: err.message,
      });
    } else {
      user.resumes.splice(user.resumes.indexOf(req.body.resumeId), 1);
      if (
        user.published !== undefined &&
        user.published &&
        user.published.toString() === req.body.resumeId
      ) {
        user.published = null;
      }
      user.save((err) => {
        if (err) {
          res.status(500).json({
            message: err.message,
          });
        } else {
          Resume.deleteOne({
            _id: mongoose.Types.ObjectId(req.body.resumeId),
          }).then(
            res.json({
              published: user.published,
            })
          );
        }
      });
    }
  });
});

app.post("/resume/add", async (req, res) => {
  if (req.body.id !== undefined) {
    Resume.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(req.body.id) },
      {
        resumetitle: req.body.resumetitle,
        name: req.body.name,
        title: req.body.title,
        photo: req.body.photo,
        email: req.body.email,
        phone: req.body.phone,
        loc: req.body.loc,
        details: req.body.details,
        sections: req.body.sections,
      },
      // update
      (err, savedResume) => {
        if (err) {
          res.status(500).json({
            message: err.message,
          });
        } else {
          // console.log(savedResume);
          res.json(savedResume);
        }
      }
    );
  } else {
    // console.log(req.body.sections[0].items[0]);
    const userId = await User.findOne({ username: req.body.user.username });
    const resume = new Resume({
      user: userId,
      resumetitle: req.body.resumetitle,
      name: req.body.name,
      title: req.body.title,
      photo: req.body.photo,
      email: req.body.email,
      phone: req.body.phone,
      loc: req.body.loc,
      details: req.body.details,
      sections: req.body.sections,
    });
    console.log(resume);
    resume.save((err, savedResume) => {
      if (err) {
        res.status(500).json({
          message: err.message,
        });
      } else {
        User.findOneAndUpdate(
          { username: req.body.user.username },
          { $push: { resumes: savedResume._id } },
          function (err) {
            if (err) {
              res.status(500).json({
                message: err.message,
              });
            } else {
              // console.log(savedResume);
              res.json(savedResume);
            }
          }
        );
      }
    });
  }
});

app.get("/resume/:id", (req, res) => {
  const id = req.params.id;
  Resume.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).json({ message: "Not found resume with id " + id });
      else {
        console.log(data);
        res.json(data);
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Error retrieving resume with id " + id });
    });
});

app.get("/user/:username", (req, res) => {
  const username = req.params.username;
  User.findOne({ username })
    .populate("published")
    .then((data) => {
      if (!data)
        res
          .status(404)
          .json({ message: "Not found user with username " + username });
      else res.json({ published: data.published });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Error retrieving resume with username " + username });
    });
});

app.get("/network", async (req, res) => {
  const name = req.query.name ?? "";
  if (name === "") {
    User.find({ published: { $ne: null } })
      .populate("published")
      .select("username published")
      .exec((err, users) => {
        if (err) {
          res.status(500).json({
            message: err.message,
          });
        } else {
          res.json({ users });
        }
      });
  } else {
    const resumeIds = await Resume.find({
      name: { $regex: name, $options: "i" },
    });
    const resumeIdArray = resumeIds.map((resume) => resume.id);

    User.find({ published: { $in: resumeIdArray } })
      .populate("published")
      .exec((err, users) => {
        if (err) {
          res.status(500).json({
            message: err.message,
          });
        } else {
          res.json({ users });
        }
      });
  }
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
        // console.log(req.session.user);
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
