import { Route, Routes } from "react-router-dom";
import Login from "./Components/Login.jsx";
import Register from "./Components/Register.jsx";
import Home from "./Components/Home.jsx";
import Project from "./Components/Project.jsx";
import Userauth from "./auth/Userauth.jsx";
function App() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/project" element={<Project />} />
    </Routes>
  );
}

export default App;
