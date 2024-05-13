import React, { useState, useContext } from "react";
import Header from "./Header";
import axios from "axios";
import { API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

const Login = () => {
  const [isLogin, setisLogin] = useState(false);
  const [fullName, setfullName] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const {User, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginHandler = () => {
    setisLogin(!isLogin);
  };
  if(User)
  navigate('/browse');
console.log("User" ,User);
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true when form is being submitted

    if (isLogin) {
      // Login logic
      const user = { email, password };
      try {
        const res = await axios.post(`${API_END_POINT}/login`, user, {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
        console.log("res",res);
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          setUser(res?.data?.user);
          console.log("Userdata",res?.data?.user?.fullName);
          navigate("/browse");
        }
      } catch (error) {
        toast.error(error?.response?.data?.message);
        console.log(error);
      }
    } else {
      // Sign up logic
      const user = { fullName, email, password };
      try {
        const res = await axios.post(`${API_END_POINT}/register`, user, {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
        console.log(res);
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          setisLogin(true);
        }

      } catch (error) {
        toast.error(error?.response?.data?.message);
        console.log(error);
      }
    }

    // Reset form fields after submission
    setemail("");
    setpassword("");
    setfullName("");

    setLoading(false); // Set loading state back to false after submission is complete
  };

  return (
    <div className="bg-white">
    
      <Header />
      <div className="flex ">
        <div className="w-[60%] mt-10">
          <img
            className=" h-[112%] opacity-80 "
            src="https://images.pexels.com/photos/4466999/pexels-photo-4466999.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="error"
          ></img>
        </div>
        <div className="">
          <div className="w-96 ml-20 mt-32 items-center py-2 rounded-lg p-4">
            <form className="" onSubmit={(e) => submitHandler(e)}>
              <h1 className="font-bold text-2xl ml-[35%]">
                {isLogin ? "Login" : "Sign Up"}
              </h1>
              <div className="flex flex-col gap-3 mt-4">
                {!isLogin && (
                  <input
                    value={fullName}
                    onChange={(e) => setfullName(e.target.value)}
                    className="px-2 border-2 border-gray-300 bg-gray-100 py-2 text-lg m-0 outline-none rounded-xl"
                    type="text"
                    placeholder="Full Name"
                  />
                )}
                <input
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  className="px-2 py-2 border-2 border-gray-300 bg-gray-100  outline-none text-lg m-0  rounded-xl"
                  type="email"
                  placeholder="Email"
                />
                <input
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  className="px-2 py-2 border-2 border-gray-300 bg-gray-100 outline-none text-lg m-0  rounded-xl"
                  type="password"
                  placeholder="Password"
                />
                <button
                  className="bg-gray-800 mt-6 font-bold text-white py-2 rounded-xl"
                  disabled={loading}
                >
                  {loading ? "Loading.." : isLogin ? "Login" : "Sign Up"}
                </button>
                <p className="">
                  {isLogin ? "New to Memoria ?" : "Already have an account?"}
                  <span
                    onClick={loginHandler}
                    className="ml-2 text-blue-900 cursor-pointer font-semibold tracking-tighter "
                  >
                    {" "}
                    {isLogin ? "Sign Up" : "Login"}{" "}
                  </span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login
