import { useLocation } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import axios from "../config/axiosconfig.js";
import {
  initialiseSocket,
  recieveMessage,
  sendMessage,
} from "../config/io.config.js";
import { UserContext } from "../context/user.context.jsx";
import Markdown from "markdown-to-jsx";
import MonacoEditor from "@monaco-editor/react"; // Import Monaco Editor

const Project = () => {
  const messageBox = useRef();
  const { user } = useContext(UserContext);
  const location = useLocation();
  const [isPanel, setIsPanel] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [projectUsers, setProjectUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [FileTree] = useState({
    "app.js": {
      content: `const express = require('express');
  const app = express();
  const port = 3000;
  
  // Middleware to parse JSON bodies
  app.use(express.json());
  
  // Basic route
  app.get('/', (req, res) => {
    res.send('Hello, World from Express!');
  });
  
  // Import routes
  const userRoutes = require('./routes/users');
  app.use('/users', userRoutes);
  
  // Start the server
  app.listen(port, () => {
    console.log(\`Server is running on http://localhost:\${port}\`);
  });
  `,
    },
    "routes/users.js": {
      content: `const express = require('express');
  const router = express.Router();
  
  // Sample user data
  let users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ];
  
  // Route to get all users
  router.get('/', (req, res) => {
    res.json(users);
  });
  
  // Route to get a single user by ID
  router.get('/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).send('User not found');
    res.json(user);
  });
  
  module.exports = router;
  `,
    },
    "package.json": {
      content: `{
    "name": "express-server",
    "version": "1.0.0",
    "description": "A basic but robust Express.js server",
    "main": "app.js",
    "scripts": {
      "start": "node app.js"
    },
    "dependencies": {
      "express": "^4.18.2"
    }
  }`,
    },
    "readme.md": {
      content: `# Express Server Project

This is a basic Express server that provides RESTful APIs to manage users. The project includes simple routes for displaying a list of users and fetching user details by their ID.

## Features

- Basic Express setup
- Routes to get user data
- Sample user data available in the backend

## Installation

1. Clone this repository or download the files.
2. Install the dependencies:
  
`,
    },
  });

  const [currentFile, setCurrentFile] = useState(null);
  const [openedFiles, setOpenedFiles] = useState([]);

  const addCollaborator = () => {
    const selectedUserIds = users
      .filter((user) =>
        selectedUsers.some((selected) => selected.email === user.email)
      )
      .map((user) => ({
        id: user._id,
        email: user.email,
      }));

    const alreadyInProject = selectedUserIds.filter((userId) =>
      projectUsers.some((projectUser) => projectUser._id === userId)
    );

    if (alreadyInProject.length > 0) {
      const alreadyInEmails = users
        .filter((user) => alreadyInProject.includes(user.email))
        .map((user) => user.email);

      setErrorMessage(
        `The following users are already in the project: ${alreadyInEmails.join(
          ", "
        )}.`
      );
      return;
    }

    axios
      .put("/project/add-user", {
        projectId: location.state.project._id,
        users: selectedUsers, // Array of user IDs
      })
      .then((res) => {
        console.log(res.data);

        if (Array.isArray(res.data)) {
          setProjectUsers((prev) => [...prev, ...res.data]);
        } else {
          setErrorMessage("Failed to add users. Invalid response format.");
        }

        setSelectedUsers([]);
        setIsModalOpen(false);
        setErrorMessage("");
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage("A user is already in the project");
      });
  };

  // socket setup
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, projectResponse] = await Promise.all([
          axios.get("/auth/all"),
          axios.get(`/project/get-project/${location.state.project._id}`),
        ]);

        setUsers(usersResponse.data);
        if (Array.isArray(projectResponse.data.users)) {
          setProjectUsers(projectResponse.data.users || []);
        } else {
          console.error(
            "Expected an array but received:",
            projectResponse.data.users
          );
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [location.state.project._id]);

  useEffect(() => {
    const socket = initialiseSocket(location.state.project._id);
    recieveMessage("project-message", (data) => {
      console.log(data);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: data.sender,
          content: data.content,
          senderEmail: data.senderEmail,
        },
      ]);
    });

    return () => {
      socket.disconnect(); // Clean up the socket connection on component unmount
    };
  }, [location.state.project._id]);

  useEffect(() => {
    if (messageBox.current) {
      messageBox.current.scrollTop = messageBox.current.scrollHeight;
    }
  }, [messages]);

  const toggleUserSelection = (userEmail) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userEmail)
        ? prevSelected.filter((email) => email !== userEmail)
        : [...prevSelected, userEmail]
    );
  };

  // Send message handler
  const sendMessageHandler = () => {
    if (message.trim()) {
      sendMessage("project-message", {
        sender: user._id,
        content: message,
        senderEmail: user.email,
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: user._id, content: message, senderEmail: user.email },
      ]);

      setMessage("");
    }
  };

  const handleFileClick = (fileName) => {
    if (!openedFiles.includes(fileName)) {
      setOpenedFiles((prev) => [...prev, fileName]);
    }
    setCurrentFile(FileTree[fileName]);
  };

  const closeFile = (fileName) => {
    setOpenedFiles((prev) => prev.filter((file) => file !== fileName));
    if (currentFile && currentFile.content === FileTree[fileName].content) {
      setCurrentFile(null);
    }
  };

  return (
    <main className="h-screen w-screen flex relative">
      <section className="bg-zinc-900 h-full w-[60vw] sm:w-[30vw] flex flex-col justify-between relative">
        <header className="w-full flex justify-between py-3 px-2 bg-zinc-800 shadow-md">
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-white text-[14px]"
          >
            <i className="ri-add-line mr-1"></i>Add Collaborators
          </button>
          <button onClick={() => setIsPanel(true)}>
            <i className="ri-group-fill text-purple-800 text-2xl"></i>
          </button>
        </header>

        <div
          ref={messageBox}
          className="flex-grow p-4 overflow-y-auto scroll-smooth message-scrollbar"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === user._id ? "justify-end" : "items-start"
              } my-1`}
            >
              <div
                className={`bg-${
                  message.sender === user._id ? "purple" : "gray"
                }-800 text-white  rounded-lg ${
                  message.senderEmail === "genieAI"
                    ? " p-[5px] max-w-96"
                    : "p-2 max-w-[80%]"
                }`}
              >
                <span className="block text-xs text-gray-400 mb-1">
                  {message.senderEmail}
                </span>
                <p>
                  {message.senderEmail === "genieAI" ? (
                    <div className="overflow-auto bg-zinc-900 text-sm p-2 scroll-smooth message-scrollbar rounded-lg text-white">
                      <Markdown>{message.content}</Markdown>
                    </div>
                  ) : (
                    <p>{message.content}</p>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>

        <footer className="flex items-center p-3 bg-zinc-700">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="p-2 rounded-lg outline-none w-full bg-zinc-600 text-white placeholder-gray-400"
            type="text"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessageHandler}
            className="ml-3 p-2 rounded-full bg-purple-800 hover:bg-purple-700 text-white"
          >
            <i className="ri-send-plane-fill text-lg"></i>
          </button>
        </footer>

        <div
          className={`absolute top-0 left-0 h-full w-full bg-gray-800 shadow-lg transform transition-transform duration-300 ${
            isPanel ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <header className="flex justify-between items-center p-4 bg-gray-700">
            <h2 className="text-white text-lg">Collaborators</h2>
            <button
              onClick={() => setIsPanel(false)}
              className="text-white text-xl"
            >
              <i className="ri-close-fill"></i>
            </button>
          </header>
          {projectUsers.map((user, index) => (
            <div
              key={index}
              className="p-4 my-1 cursor-pointer rounded-xl hover:bg-zinc-700"
            >
              <div className="flex items-center space-x-2">
                <i className="ri-user-follow-fill text-white"></i>
                <span className="text-white">{user.email}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex-grow flex bg-zinc-900">
        {/*  File Names */}
        <div className="h-[98%] mt-2 rounded-lg w-[15vw]  sm:block sm:w-[10vw]  ml-2  bg-purple-800  overflow-y-auto">
          <h2 className="text-white font-bold uppercase text-lg mb-2 px-4 py-2">
            Files<i className="ri-file-4-line text-black ml-1"></i>
          </h2>
          <ul className="px-3">
            {Object.keys(FileTree).map((file, index) => (
              <li
                key={index}
                onClick={() => handleFileClick(file)}
                className="text-white cursor-pointer hover:bg-gray-700 py-1 px-2 rounded"
              >
                {file}
              </li>
            ))}
          </ul>
        </div>

        {/*  Code Editor */}
        <div className="flex-grow px-1 py-1 sm:p-4  w-[25vw] sm:w-[50vw] overflow-hidden">
          <h1 className="text-purple-800 font-bold uppercase text-lg  sm:mb-2">
            Code Editor <i className="ri-code-line "></i>
          </h1>
          {openedFiles.length > 0 && (
            <div className="flex space-x-1 mb-1">
              {openedFiles.map((fileName, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-1 bg-zinc-800 text-white p-1 rounded"
                >
                  <span>{fileName}</span>
                  <button
                    onClick={() => closeFile(fileName)}
                    className="text-red-500"
                  >
                    <i className="ri-close-fill text-xs"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
          {currentFile ? (
            <MonacoEditor
              theme="vs-dark"
              height="80vh"
              language="javascript"
              value={currentFile.content}
              options={{
                selectOnLineNumbers: true,
                minimap: { enabled: false },
                errors: false,
              }}
            />
          ) : (
            <div className="text-white  text-2xl flex items-center justify-center h-full ">
              Select a file to edit.
            </div>
          )}
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Add Collaborators</h3>
            {users.map((user) => (
              <div key={user._id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user._id)}
                  onChange={() => toggleUserSelection(user._id)}
                />
                <span>{user.email}</span>
              </div>
            ))}
            {errorMessage && (
              <p className="text-red-500 mt-2">{errorMessage}</p>
            )}
            <div className="mt-4">
              <button
                onClick={addCollaborator}
                className="bg-blue-600 text-white py-2 px-4 rounded"
              >
                Add Collaborators
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="ml-2 bg-gray-600 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Project;
