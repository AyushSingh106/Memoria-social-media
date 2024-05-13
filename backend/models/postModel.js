import mongoose from "mongoose";
const postSchema=mongoose.Schema({
    user:{
    type:mongoose.Schema.Types.ObjectId,
    ref: "user"
        },
     title: String,
     description: String,
     image: String,
     posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
      }]
    });
    export const Post=mongoose.model("post",postSchema);