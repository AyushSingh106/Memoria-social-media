import React, { useContext } from "react";
import UserContext from "../context/UserContext";
import axios from "axios";
import toast from "react-hot-toast";
import { API_END_POINT } from "../utils/constant";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { User, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${API_END_POINT}/logout`);
      if (res.data.success) {
        toast.success(res.data.message);
        setUser(null); // Update User context value to null directly
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between p-2 fixed w-full top-0 z-50  bg-white">
        <div className="mt-2">
          <img
            className="w-12 mt-0 p-2 rounded-full"
            src="https://banner2.cleanpng.com/20180617/xjg/kisspng-black-and-white-camera-photography-clip-art-camera-clipart-5b26dfc72797f2.7657671915292743111622.jpg"
            alt="logo"
          />
        </div>
        <h1 className="text-black font-bold from-neutral-400 ml-3 text-3xl">
          Memoria
        </h1>
        <div className="flex items-center gap-10 px-3">
          {User && (
            <button onClick={logoutHandler} className="bg-red-800 rounded-lg p-2 text-white">
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
