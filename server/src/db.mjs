import mongoose from "mongoose";
import mongooseSlugPlugin from "mongoose-slug-plugin";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  hash: { type: String, unique: true, required: true },
  email: { type: String, required: true },
  lastvisited: { type: Date, default: Date.now },
  published: { type: mongoose.Schema.Types.ObjectId, ref: "Resume" },
  resumes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resume" }],
});

const ResumeSchema = new mongoose.Schema(
  {
    resumetitle: { type: String, required: true },
    name: String,
    title: String,
    // photo: {
    //   data: Buffer,
    //   contentType: String,
    // },
    email: String,
    phone: String,
    loc: String,
    //details: [String],
    //lastEdited: { type: Date },
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

mongoose.connect("mongodb://localhost/final-project");
