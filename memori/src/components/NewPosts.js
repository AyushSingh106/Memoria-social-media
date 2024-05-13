import React , {useContext} from 'react';
import Header from './Header';
import { API_END_POINT } from '../utils/constant';
import { useNavigate } from "react-router-dom";
import UserContext from '../context/UserContext';
import {toast,  Toast } from 'react-hot-toast';

const NewPosts = () => {
  // Function to handle form submission
  const {User,setUser } = useContext(UserContext);
  const {Clicks,setClicks}=useContext(UserContext);
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!User) {
      console.error('User data is not available');
    return ;}
    console.log(event.target)
    const formData = new FormData(event.target); // Create FormData object from the form
    formData.append('email', User?.email);
    console.log("ayush");
    try {
      // Send POST request to the specified route with form data
      const response = await fetch(`${API_END_POINT}/createPost`, {
        method: 'POST',
        body: formData,
      });
   console.log("response=",response);
      // Handle response based on status
      if (response.status===200) {
        // Success case: Redirect or show a success message
        toast.success('New Post Added');
        console.log('Post created successfully');
        console.log(User.posts);
   
      } else {
        // Error case: Handle errors, e.g., show an error message
        console.error('Failed to create post');
        toast.error('Failed to create post');
      }
    } catch (error) {
      toast.error(error);
      console.error('Error:', error);
    }
    navigate("/browse");
  };

  return (
    <div>
      <div className='mb-5'>
        <Header />
      </div>
      <div>
        <div className="w-full min-h-screen bg-cyan-700 px-10 py-5 ">
          <h1 className="text-white mt-10  font-serif font-bold text-xl ml-32">Let's Create a new post</h1>
          <hr className="opacity-10 text-cyan-800 mt-3" />
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <input className="text-black block w-1/3 px-3 py-2 border-2 mt-2 rounded-md" type="file" name="postimage" />
            <input className="text-black block w-1/3 px-3 py-2 border-2 mt-2 rounded-md" type="text" placeholder="Title" name="title" />
            <textarea className="text-black block h-[10vw] w-1/3 px-3 py-2 mt-2 rounded-md" type="text" placeholder="Description.." name="description"></textarea>
            <input className="block w-1/3 px-3 py-2 bg-red-600 mt-2 text-white font-bold rounded-md" type="submit" value="Submit" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewPosts;
