import mongoose, { Schema } from 'mongoose';

const schema = new Schema(
  {
    _id: { type: String },
    leadId: { type: String },
    name: { type: String },
    userId: { type: String },
    tag: { type: String },
    image: { type: String },
    gender: { type: String },
    dob: { type: Date },
    contacts: { type: Number },
    email: { type: String },
    notes: { type: String },
  }, {
    timestamps: true
  }
);

const Lead = mongoose.model('lead', schema);

export default Lead;
