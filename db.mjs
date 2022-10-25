import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
	username: String,
    hash: String,
    email: String,
    lastvisited: { type: Date, default: Date.now },
    published: Schema.Types.ObjectId,
    resumes: [ Schema.Types.ObjectId ]
});

const ResumeSchema = new mongoose.Schema({
    id: Number,
    photo: 
    {
        data: Buffer,
        contentType: String
    },
    personalInfo: 
    { type: String },
    lastEdited: { type: Date },
    sections: [ Schema.Types.ObjectId ]
})

const SectionSchema = new mongoose.Schema({
    id: Number,
    name: String,
    type: String,
    data: [ String ]
})

mongoose.model('User', UserSchema)
mongoose.model('Resume', ResumeSchema)
mongoose.model('Section', SectionSchema)

//mongoose.connect('mongodb://localhost/final-project');

export default{
	UserSchema,
    ResumeSchema,
    SectionSchema
}


