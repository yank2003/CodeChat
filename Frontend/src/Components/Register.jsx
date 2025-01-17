import { useState, useContext } from "react";
import axios from "../config/axiosconfig.js";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user.context.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleRegister = (e) => {
    e.preventDefault();
    axios
      .post(`/auth/signup`, {
        email,
        password,
      })
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        navigate("/home");
        toast.success("Registered successfully");
      })
      .catch((error) => {
        console.error("Error registering user", error);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white">
      <div className="w-full max-w-[40vh] sm:max-w-md p-6 bg-purple-800 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-center mb-6 text-white">
          **CODECHAT**
        </h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 bg-purple-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 bg-purple-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 rounded-lg transition duration-300"
          >
            Sign Up
          </button>
        </form>
        <ToastContainer />
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-indigo-400 hover:text-indigo-500 transition duration-300"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
