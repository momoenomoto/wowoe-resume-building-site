import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
	username: { type: String, required: true },
    hash: { type: String, unique: true, required: true },
    email: { type: String, required: true },
    lastvisited: { type: Date, default: Date.now },
    published: Schema.Types.ObjectId,
    resumes: [ {type: Schema.Types.ObjectId, ref: 'Resume'} ]
});

const ResumeSchema = new mongoose.Schema({
    _id: Schema.Types.ObjectId,
    name: { type: String, required: true },
    first: String,
    last: String,
    title: String,
    photo: 
    {
        data: Buffer,
        contentType: String
    },
    email: [ String ],
    phone: [ Number ],
    loc: String,
    lastEdited: { type: Date },
    sections: [ {type: Schema.Types.ObjectId, ref: 'Section'} ]
})

const SectionSchema = new mongoose.Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    subsections: [ SubSectionSchema ],
    data: String
})

const SubSectionSchema = new mongoose.Schema({
    name: String,
    type: String,
    data: String
})

mongoose.model('User', UserSchema)
mongoose.model('Resume', ResumeSchema)
mongoose.model('Section', SectionSchema)
mongoose.model('SubSection', SubSectionSchema)

//mongoose.connect('mongodb://localhost/final-project');

export default{
	UserSchema,
    ResumeSchema,
    SectionSchema,
    SubSectionSchema
}


