import express from "express";
import { Register,Login ,Logout,GetPost ,GetAllPost,DeletePost, LikeorDislike, GetCookie} from "../controllers/user.js";
import { upload } from "../index.js";
const router=express.Router();
router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/logout").get(Logout);
router.route("/getPost").get(GetPost);
router.route("/getAllPost").get(GetAllPost);
router.route("/deletePost").delete(DeletePost);
router.route("/like").get(LikeorDislike);
export default router;