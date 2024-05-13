import express from "express";
import { config } from "dotenv";
import databaseConnection from "./utils/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import cors from "cors";
import multer, { diskStorage } from "multer";
import { findById } from "./controllers/user.js";
import { User } from "./models/userModel.js";
import { fileURLToPath } from "url";
import path from "path";
import { Post } from "./models/postModel.js";

// Get the directory name of the current module using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Set up Multer storage
const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/"); // Specify the destination directory for profile pictures
  },
  filename: function (req, file, cb) {
    // Generate a unique filename
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Create multer instance with the specified storage settings
export const upload = multer({ storage: storage });

databaseConnection();
config();

const app = express();
//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Serve the 'public' folder as a static directory
app.use("/public", express.static(path.join(__dirname, "public")));

const corsoption = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsoption));

//api
app.post("/api/v1/user/changeDp", upload.single("image"), async (req, res) => {
  const email = req.body.email;
  const image = req.file;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Update the user's dpUrl with the URL of the uploaded file
    user.profileImage = `/public/${image.filename}`; // Assuming the file is stored in the 'public' folder

    // Save the updated user
    const updatedUser = await user.save();
    console.log("updatedUser", updatedUser);

    console.log("Email:", email);
    console.log("Image:", image);

    // Respond with success status
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});
app.post(
  "/api/v1/user/createPost",
  upload.single("postimage"),
  async function (req, res, next) {
    const email = req.body.email;
    try {
      // Find the user by their username
      const user = await User.findOne({email});
      console.log("After Adding post",user);
      // Create the post
      const post = await Post.create({
        user: user._id,
        title: req.body.title,
        description: req.body.description,
        image: req.file.filename, // Save the filename of the uploaded image
      });

      // Push the post ID to the user's posts array
      user.posts.push(post._id);
      
      // If the user has a profile picture (DP), update the post's image field with it
      if (user.profilePicture) {
        post.image = user.profilePicture;
      }

      // Save changes to the user and the post
      await Promise.all([user.save(), post.save()]);

      // Redirect to the user's profile
      // res.redirect("/browse");
      res.status(200).json({ user: user });
    }
  catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }

});


app.use("/api/v1/user", userRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server listen at ${process.env.PORT}`);
});

export default router;
