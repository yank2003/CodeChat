import { ProjectModel } from "../models/project.model.js";

export const createProject = async (name, userId) => {
  if (!name || !userId) {
    throw new Error("Name and user id are required");
  }

  const project = await ProjectModel.create({ name, users: [userId] });

  return project;
};

export const getAllProjectById = async (userId) => {
  if (!userId) {
    throw new Error("User id is required");
  }
  const allUserProjects = await ProjectModel.find({ users: userId });

  return allUserProjects;
};
