import { User } from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { upload } from "../index.js";
import { Post } from "../models/postModel.js";

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "INVALID Credentials",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "INVALID EMAIL OR PASSWORD",
        success: false,
      });
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "INVALID EMAIL OR PASSWORD",
        success: false,
      });
    }
    const tokenData = {
      id: user._id,
    };  
    const token = jwt.sign(tokenData, "janewlincwlevne", { expiresIn: "1h" });
    return res
      .status(200)
      .cookie("token", token, { httpOnly: true })
      .json({
        message: `Welcome Back ${user.fullName}`,
        user: user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};
export const Register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(401).json({
        message: "Please Complete All Fields",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "Ihis Email Is Already Been Used",
        success: false,
      });
    }
    const hashedPassword = await bcryptjs.hash(password, 16);
    await User.create({
      fullName,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      message: "Account Created Successfully",
      success: "true",
    });
  } catch (error) {
    console.log(error);
  }
};
export const Logout = async (req, res) => {
  return res
    .status(200)
    .cookie("token", "", { expiresIn: new Date(Date.now()), httpOnly: true })
    .json({
      message: "User Loged Out Successfully",
      success: true,
    });
};
export const GetPost = async (req, res) => {
  try {
    const userId = req.query.id // Replace this with the actual user id you want to query for
    console.log("this is my user", userId);
    // Find all posts where the user field matches the userId
    const posts = await Post.find({ user: userId });

    // Log the posts to ensure they are retrieved correctly
    console.log("Retrieved posts:", posts);

    // Send the posts as a response
    res.status(200).json({ message: "success", posts: posts });
  } catch (error) {
    console.error("Error searching posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const GetAllPost = async (req, res) => {
  try {
    // Find all posts and populate the 'user' field to include only the 'name' property
    const posts = await Post.find().populate('user', 'name');
  //  const userId=posts.userId;
   console.log("cookies",req.cookies['token']);
    console.log("Retrieved posts:", posts);
    // const post_data = await Post.find({ user: userId });
  
    // Format the response to include user name and post details
    const formattedPosts = await Promise.all(posts.map(async (post) => {
      try {
        const user = await User.findById(post.user._id); // Fetch the user by their ID
        if (!user) throw new Error('User not found'); // Handle the case where the user is not found
    
        return {
          username: user.fullName, // Access the user's fullname
          title: post.title,
          description: post.description,
          image: post.image,
          likes: post.posts.length,
          postsArray: post.posts,
          id: post._id,
        };
      } catch (error) {
        console.error('Error fetching user:', error);
        return null; // Return null if there's an error
      }
    }));
    console.log("new format",formattedPosts);
    res.status(200).json({ message: "success", posts: formattedPosts });
  } catch (error) {
    console.error("Error searching posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const DeletePost = async (req, res) => {
  try {
    const  id_post = req.query.id_post;
    const  id_user = req.query.id_user;
    console.log("Deleting post:", id_post);
    // Check if the user is authorized to delete the post
    // You may want to add additional validation logic here, such as checking if the post belongs to the user
    // For simplicity, we'll just check if the user ID matches the one provided in the request
    // if (id_user !== req.user._id) {
    //   return res.status(401).json({ error: 'Unauthorized' });
    // }
   
    // Delete the post from the database
    await Post.findByIdAndDelete(id_post);
    await User.findByIdAndUpdate(id_user, { $pull: { posts: id_post } });

    // Send a success response
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
export const LikeorDislike = async (req, res) => {
try {
  const loggedInUser = req.query.id_user;
  const postId = req.query.id_post;
  console.log("post",postId);
  console.log("user",loggedInUser);
  const post = await Post.findById(postId); 
  if(post.posts.includes(loggedInUser)){
 await Post.findByIdAndUpdate(postId, { $pull: { posts: loggedInUser } });
 return res.status(200).json({ message: "Post disliked",updated_post: post });  
}
  else{
    await Post.findByIdAndUpdate(postId, { $push: { posts: loggedInUser } });
return res.status(200).json({message: "Post liked",updated_post: post });
  } 
}
catch (error) {
  console.log(error);
}
};
 export const GetCookie=async (req,res)=>
 {
  console.log("cookies",req.cookies['token']);
  try {
    
  } catch (error) {
    console.log(error);
  }

 }
export const findById = async (userId) => {
    try {
      // Use the findById method provided by your ORM or database library
      const user = await User.findById(userId);
      return user; // Return the user object if found
    } catch (error) {
      throw new Error(`Error finding user by ID: ${error.message}`);
    }
  };


 
  

