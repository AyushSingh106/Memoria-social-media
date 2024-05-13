import React, { useState, useContext, useEffect } from "react";
import UserContext from "../context/UserContext";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { API_END_POINT } from "../utils/constant";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
// import { FaRegHeart } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
// import cookies from 'js-cookie';

const Browse = () => {
  const { User, setCount, count } = useContext(UserContext);
  // const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
   
      try {
        console.log("this is my user", User?._id);
        const res = await axios.get(`${API_END_POINT}/getPost`, {
          params: {
            id: User._id,
          },
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("Response for post", res?.data?.posts);
        setPosts(res?.data?.posts);
        setCount(res?.data?.posts?.length);
      } catch (error) {
        console.error("Error fetching posts:", error);
        // Handle error
      }
    };

    fetchPosts();
  }, [User?._id]);

 
  const handleDeletePost = async (postId) => {
    console.log("Deleting post:", postId);
    console.log("User:", User._id);
    try {
      const res = await axios.delete(`${API_END_POINT}/deletePost`, {
        params: {
          id_post: postId,
          id_user: User._id,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Post deleted:", res.data);
      // After successful deletion, update the posts state to remove the deleted post
      setPosts(posts.filter((post) => post?._id !== postId));
      setCount(count - 1);
      toast.success("Post deleted successfully");
    } catch (error) {
      toast.error("Error deleting post");
      console.error("Error deleting post:", error);
      // Handle error
    }
  };

  return (
    <div className="bg-gray-800">
      <Header />
      <div className="profile w-full h-full bg-cover bg-gradient-to-br from-blue-400 to-pink-400">
        <div className="flex w-full min-h-screen">
          <Sidebar />
          <div className="w-fit flex items-start ml-64 px-5 mt-[100px]  gap-10 flex-wrap mb-8">
            {posts.length === 0 ? (
              <div className="text-white text-4xl font-bold">Add Posts and view here.. </div>
            ) : (
              posts.map((post, index) => (
                <div
                  key={index}
                  className="bg-blue-50 rounded-lg w-[40%] flex justify-between items-start px-2 py-2"
                >
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
                        <div className="font-semibold text-xl"><span className="text-red-500">Likes</span> : {post ? post?.posts?.length : 0}</div>
                      </div>
                      <MdDelete
                        className="text-black text-2xl cursor-pointer"
                        onClick={() =>
                          handleDeletePost(post?._id)
                        } // Call handleDeletePost function with post ID
                      />
                    </div>
                  </div>
                  <div className="w-[30%] mt-2 mr-6">
                    <p className="text-black font-mono ">
                      {post?.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;
