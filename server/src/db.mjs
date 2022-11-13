// is the environment variable, NODE_ENV, set to PRODUCTION?
import fs from "fs";
import path from "path";
import url from "url";

import mongoose from "mongoose";
import mongooseSlugPlugin from "mongoose-slug-plugin";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, unique: true, required: true },
    email: { type: String, required: true },
    published: { type: mongoose.Schema.Types.ObjectId, ref: "Resume" },
    resumes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resume" }],
  },
  { timestamps: true }
);

const ResumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    resumetitle: { type: String, required: true },
    name: String,
    title: String,
    photo: String,
    email: String,
    phone: String,
    loc: String,
    details: [
      {
        name: String,
        value: String,
      },
    ],
    sections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Section" }],
  },
  { timestamps: true }
);

const SubSectionSchema = new mongoose.Schema({
  name: String,
  type: String,
  data: String,
});

const SectionSchema = new mongoose.Schema({
  name: String,
  subsections: [SubSectionSchema],
  data: String,
});

ResumeSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

ResumeSchema.plugin(mongooseSlugPlugin, { tmpl: "<%=resumetitle%>" });
UserSchema.plugin(mongooseSlugPlugin, { tmpl: "<%=username%>" });

mongoose.model("User", UserSchema);
mongoose.model("Resume", ResumeSchema);
mongoose.model("Section", SectionSchema);
mongoose.model("SubSection", SubSectionSchema);

let dbconf;
if (process.env.NODE_ENV === "PRODUCTION") {
  // if we're in PRODUCTION mode, then read the configration from a file
  // use blocking file io to do this...
  const fn = path.join(__dirname, "config.json");
  const data = fs.readFileSync(fn);

  // our configuration file will be in json, so parse it and set the
  // conenction string appropriately!
  const conf = JSON.parse(data);
  dbconf = conf.dbconf;
} else {
  // if we're not in PRODUCTION mode, then use
  dbconf = "mongodb://localhost/final-project";
}

mongoose.connect(dbconf);
