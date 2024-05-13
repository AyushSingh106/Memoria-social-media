import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  profileImage: String,
  password: {
    type: String,
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "post"
  }],
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "post"
  }]
}, { timestamps: true });

export const User = mongoose.model("user", userSchema);
