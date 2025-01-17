import { useState, useContext } from "react";
import axios from "../config/axiosconfig.js";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user.context.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post("/auth/login", {
        email,
        password,
      })
      .then((res) => {
        toast.success("Logged in successfully");
        localStorage.setItem("token", res.data.token);
        console.log(res.data);
        setUser(res.data.user);
        navigate("/home");
      })
      .catch((error) => {
        console.log(error);
        toast.error("User not found");
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 text-white">
      <div className="w-full max-w-[40vh] sm:max-w-md p-6 bg-black rounded-lg shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
            CODECHAT
          </h1>
        </div>
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-800 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition duration-300"
          >
            Login
          </button>
          <ToastContainer />
        </form>
        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-purple-400 hover:text-purple-500 transition duration-300"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
