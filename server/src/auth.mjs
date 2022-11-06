import bcrypt from "bcryptjs";
import mongoose from "mongoose";

// assumes that User was registered in `./db.mjs`
const User = mongoose.model("User");

const startAuthenticatedSession = (req, user, cb) => {
  req.session.regenerate((err) => {
    if (!err) req.session.user = user;
    else console.log(err);
    cb(err);
  });
};

const endAuthenticatedSession = (req, cb) => {
  req.session.destroy((err) => {
    cb(err);
  });
};

const register = (
  username,
  email,
  password,
  errorCallback,
  successCallback
) => {
  // client-side form validation
  User.findOne({ username }, (err, result) => {
    if (err) {
      console.log(err);
      errorCallback({ message: "USERNAME ERROR" });
    } else if (result) {
      errorCallback({ message: "USERNAME ALREADY EXISTS" });
    } else {
      bcrypt.hash(password, 10, function (err, hash) {
        if (err) {
          console.log(err);
          errorCallback({ message: "PASSWORD ERROR" });
        } else {
          const user = new User({
            username,
            password: hash,
            email,
          });
          user.save((err, savedUser) => {
            if (err) errorCallback({ message: "DOCUMENT SAVE ERROR" });
            else successCallback(savedUser);
          });
        }
      });
    }
  });
};

const login = (username, password, errorCallback, successCallback) => {
  User.findOne({ username }, (err, user) => {
    if (!err && user) {
      bcrypt.compare(password, user.password, (err, passwordMatch) => {
        // regenerate session if passwordMatch is true
        if (err) errorCallback({ message: "PASSWORD ERROR" });
        else if (passwordMatch) successCallback(user);
        else errorCallback({ message: "PASSWORDS DO NOT MATCH" });
      });
    } else {
      errorCallback({ message: "USER NOT FOUND" });
    }
  });
};

// creates middleware that redirects to login if path is included in authRequiredPaths
const authRequired = (authRequiredPaths) => {
  return (req, res, next) => {
    if (authRequiredPaths.includes(req.path)) {
      if (!req.session.user) {
        res.redirect("/login");
      } else {
        next();
      }
    } else {
      next();
    }
  };
};

export {
  startAuthenticatedSession,
  endAuthenticatedSession,
  register,
  login,
  authRequired,
};
