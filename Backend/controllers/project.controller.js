import { UserModel } from "../models/user.model.js";
import { ProjectModel } from "../models/project.model.js";
import {
  createProject,
  getAllProjectById,
} from "../services/project.service.js";

export const project = async (req, res) => {
  try {
    const { name } = req.body;

    // Use req.userId directly as it contains the userId from the JWT token
    const loggedIn = await UserModel.findById(req.userId);

    if (!loggedIn) {
      return res.status(404).json({ message: "User not found" });
    }

    const newProject = await createProject(name, req.userId);

    return res.status(200).json(newProject);
  } catch (error) {
    console.error("Error creating project:", error);
    return res
      .status(500)
      .json({ message: "Error creating project", error: error.message });
  }
};

export const getAllProject = async (req, res) => {
  try {
    const loggedIn = await UserModel.findById(req.userId);
    const allProject = await getAllProjectById(loggedIn._id);
    return res.status(200).json({ projects: allProject });
  } catch (err) {
    console.log("Error getting all projects", err);
    res.status(404).json({ error: err.message });
  }
};

export const addToProject = async (req, res) => {
  try {
    const { projectId, users } = req.body; 

    // Validate project existence
    const project = await ProjectModel.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

   
    for (let userId of users) {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ message: `User with ID ${userId} not found` });
      }

      // Check if the user is already part of the project
      if (project.users.includes(userId)) {
        return res.status(400).json({
          message: `User with ID ${userId} is already in the project`,
        });
      }

      
      project.users.push(userId);
    }

    
    const updatedProject = await project.save();

    return res.status(200).json({
      message: "Users added to project successfully",
      updatedProject,
    });
  } catch (error) {
    console.error("Error adding users to project:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getProjectById = async (req, res) => {
  const { projectId } = req.params;
  try {
    // Find the project by ID
    const project = await ProjectModel.findById(projectId).populate(
      "users",
      "email"
    ); // Assuming 'users' is a reference to the User model

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
