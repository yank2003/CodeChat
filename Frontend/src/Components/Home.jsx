import { useState } from "react";
import axios from "../config/axiosconfig.js";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [isModal, setModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    toast.success("Logged in Successfully");
  }, []);

  useEffect(() => {
    axios
      .get("/project/all")
      .then((res) => {
        setProjects(res.data.projects);
      })
      .catch(() => {
        console.log("Failed to get projects");
      });
  }, []);

  const handleCancel = () => {
    setProjectName("");
    setModal(false);
  };

  const createProject = (e) => {
    e.preventDefault();
    console.log({ projectName });
    axios
      .post("/project/create", {
        name: projectName,
      })
      .then((res) => {
        console.log(res);
        setModal(false);
      })
      .catch(() => {
        console.log("Failed to create project");
      });
    toast.success("Project created successfully");
  };

  return (
    <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 min-h-screen text-white">
      <header className="py-4 px-6 bg-purple-800 shadow-lg">
        <h1 className="text-3xl font-bold">Project Dashboard</h1>
      </header>
      <ToastContainer />
      <main className="p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setModal(true)}
            className="bg-zinc-900 text-white px-4 py-2 rounded-lg hover:bg-zinc-700 focus:ring-4 focus:ring-purple-500"
          >
            <i className="ri-add-line mr-2"></i> New Project
          </button>
        </div>

        {isModal && (
          <form onSubmit={createProject}>
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75">
              <div className="bg-purple-800 p-6 rounded-lg w-96 shadow-xl">
                <h3 className="text-xl font-semibold mb-4 text-center">
                  Create New Project
                </h3>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full p-3 text-gray-800 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Project Name"
                />
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={handleCancel}
                    className="bg-gray-900 px-4 py-2 rounded-lg text-white hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-purple-800 px-4 py-2 rounded-lg text-white hover:bg-purple-700"
                  >
                    Create
                  </button>
                  <ToastContainer />
                </div>
              </div>
            </div>
          </form>
        )}

        <div className="bg-purple-800 md:w-[30vw] w-[40vw]  overflow-y-auto p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 border-b max-sm:text-xs border-purple-700 pb-2">
            Your Projects
          </h2>
          <ul className="space-y-4">
            {projects.length > 0 ? (
              projects.map((project) => (
                <li
                  key={project._id}
                  onClick={() => {
                    navigate("/project", {
                      state: { project },
                    });
                  }}
                  className="bg-zinc-900 p-1 md:p-4 px-2 rounded-lg hover:bg-zinc-600 cursor-pointer flex justify-between items-center"
                >
                  <div>
                    <p className="text-xs md:text-lg font-medium">
                      {project.name}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center">
                    <i className="ri-user-line mr-0 sm:mr-1 "></i>
                    <span className="before:content-[''] md:before:content-['Collaborators:_']">
                      {project.users.length}
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-center text-gray-400">
                No projects available
              </li>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
