import React, { useState, useContext } from "react";
import UserContext from "../context/UserContext";
import { FaPencil } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

// import axios from "axios";
import { API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";
const Sidebar = () => {
  const { User,setUser } = useContext(UserContext);
  const [Clicks, setClicks] = useState(UserContext);
  const navigate = useNavigate();

  const handleUploadClick = () => {
    document.querySelector("#uploadform input").click();
  };

  const handleChange = async (event) => {
    const file = event.target.files[0];
    // console.log('image', file);
    // console.log('email', User.email);
    console.log("Updated User",User);
    const formData = new FormData();
    formData.append('email', User.email);
    formData.append('image', file);

    try {
        const response = await fetch(`${API_END_POINT}/changeDp`, {
            method: 'POST',
            body: formData
        });
    //  console.log("respose",response);
        if (!response.ok) {
          toast.error('Error Occured');
            throw new Error('Error uploading image');
        }

        const responseData = await response.json();
        setUser(responseData.user);
        // console.log(response)
        toast.success('DP Updated');
         
         console.log('Posts',Clicks);
    } catch (error) {
      toast.error(error.message);
        console.error('Error:', error.message);
        // Handle error if needed
    }
};

  const createPostHandler = () => {
    navigate("/createpost");
  };

  return (
    <div>
      <div className="bg-gray-500  top-16 bottom-0 fixed w-[16%] h-screen overflow-x-hidden">
        <form
          id="uploadform"
          hidden
          action="/fileupload"
          method="post"
          encType="multipart/form-data"
        >
          <input type="file" />
        </form>
        <div className="prodets flex flex-col items-center mt-5">
          <div className="relative">
        
            <div className="w-32 h-32 bg-zinc-600 border-2 overflow-hidden rounded-full">
              <img
                className="w-full h-full object-center"
                src={User?.profileImage ? `http://localhost:8080${User.profileImage}` : "https://www.pngitem.com/pimgs/m/678-6785829_my-account-instagram-profile-icon-hd-png-download.png"}
                alt=""
              />
            </div>
          </div>
          <div className="mx-6 text-2xl font-mono mt-2">@{User?.fullName}</div>
          {/* <div className="mx-6 text-gray -800 font-semibold ">My Posts:{User?.posts.length}</div> */}
          <div className="flex items-center gap-10 mt-2  px-3">
          </div>
          <Link className="bg-gray-200 cursor-pointer rounded-lg font-bold mt-2 py-1 px-2" to="/Browse">Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;