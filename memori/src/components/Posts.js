import React, { useEffect, useContext } from "react";
import Header from "./Header";
// import Sidebar from "./Sidebar";
import UserContext from "../context/UserContext";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { API_END_POINT } from "../utils/constant";
import { useState } from "react";
import Sidebar2 from "./Sidebar2";
import toast from "react-hot-toast";


const Posts = () => {
  const [posts, setPosts] = useState(null);
  const { User } = useContext(UserContext);
  const [likecount,   ] = useState(null);
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_END_POINT}/getAllPost`,{
        withCredentials:true
      });
      setPosts(res?.data?.posts);
      console.log("res--", res?.data?.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      // Handle error
    }
  };

  const handleLikeDislike = async (postId) => {
    console.log("postId", postId);
    console.log(User?._id);
    try {
      const res = await axios.get(`${API_END_POINT}/like`, {
        params: {
          id_post: postId,
          id_user: User?._id,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success(res.data.message);
      fetchPosts();
      console.log(" final Posts", res?.data?.updated_post?.posts?.length);
    } catch (error) {
      console.error("Error liking/disliking post:", error);
      toast.error(error.message);
      // Handle error
    }
  };

  useEffect(() => {
    console.log("Likes", likecount);
  }, [likecount]);

  return (
    <div>
      <Header />
      <div className="bg-gradient-to-br from-black to-white min-h-screen">
        <Sidebar2 />
        <div className="w-fit flex items-start ml-64 px-5 mt-[50px] py-[46px] gap-10 flex-wrap mb-2">
          {posts &&
            posts.map((post, index) => (
              <div
                key={index}
                className="bg-blue-50 rounded-lg w-[40%] flex justify-between items-start px-2 py-2"
              >
                {/* <div>{post?._id}</div> */}
                <div className="w-[60%]">
                  {post?.image && (
                    (post.image.endsWith(".mp4") || post.image.endsWith(".mkv")) ? (
                      <video
                        className="h-full w-full rounded-lg"
                        src={`http://localhost:8080/public/${post?.image}`}
                        alt="Error"
                        controls
                      />
                    ) : (
                      <img
                        className="h-full w-full rounded-lg"
                        src={`http://localhost:8080/public/${post?.image}`}
                        alt="Error"
                      />
                    )
                  )}
                  <div className="flex justify-between items-center">
                     
                    <h3 className="font-black">{post?.title}</h3>
                    <div className="flex items-center gap-2">
                    <FaHeart
                      className={` ${post.postsArray.includes(User?._id) ? 'text-red-500' : 'text-black'} text-xl cursor-pointer`}
                      onClick={() => handleLikeDislike(post?.id)}
                    />
                    <div className="text-black">{post?.likes}</div>
                    </div>
                  </div>
                  <div>
                    <h1 className="font-semibold ">Created by:{post?.username}</h1>
                  </div>
                </div>
                <div className="w-[30%] mt-2 mr-6">
                  <p className="text-black font-mono ">{post?.description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Posts;
