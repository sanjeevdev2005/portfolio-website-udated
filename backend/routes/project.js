const express = require("express");

const router = express.Router();

const Project = require("../models/project");

const authMiddleware = require("../middleware/authMiddleware");




router.get("/", async (req, res) => {
    try {
      const allProjects = await Project.find({});
      res.json(allProjects);
    } catch (error) {
      res.status(500).json({message: "Failed to fetch the projects"});
    }
});

router.post("/", authMiddleware, async (req, res) => {
    try {const newProject = await Project.create(req.body);
     res.status(201).json(newProject);
    } catch (error) {
      res.status(400).json({

        message: "Failed To create the projects",
        error: error.message,

      });
    }
    
});

router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedProject) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        res.json(updatedProject);
    } catch (error) {
        res.status(400).json({
            message: "Failed to update project",
            error: error.message,
        });
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const deletedProject = await Project.findByIdAndDelete(
            req.params.id
        );

        if (!deletedProject) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        res.json({
            message: "Project deleted successfully",
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to delete project",
            error: error.message,
        });
    }
});

module.exports = router;