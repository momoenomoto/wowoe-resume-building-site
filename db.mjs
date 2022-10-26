import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
	username: String,
    hash: String,
    email: String,
    lastvisited: { type: Date, default: Date.now },
    published: Schema.Types.ObjectId,
    resumes: [ {type: Schema.Types.ObjectId, ref: 'Resume'} ]
});

const ResumeSchema = new mongoose.Schema({
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


