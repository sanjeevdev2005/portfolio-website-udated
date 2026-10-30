const express = require("express");
const router = express.Router();

const Resume = require("../models/resume");
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");

// Upload PDF to Cloudinary
function uploadToCloudinary(fileBuffer) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "portfolio/resumes",
                resource_type: "raw",
                format: "pdf",
                public_id: `resume-${Date.now()}`,
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        stream.end(fileBuffer);
    });
}

// Get current resume (public)
router.get("/", async (req, res) => {
    try {
        const resume = await Resume.findOne().sort({ createdAt: -1 });

        res.json(resume);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch resume",
        });
    }
});

// Upload or replace resume (admin only)
router.post(
    "/",
    authMiddleware,
    upload.single("resume"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    message: "Please select a PDF file",
                });
            }

            const uploadedFile = await uploadToCloudinary(req.file.buffer);

            const oldResume = await Resume.findOne();

            const resume = await Resume.findOneAndUpdate(
                {},
                {
                    fileUrl: uploadedFile.secure_url,
                    publicId: uploadedFile.public_id,
                    fileName: req.file.originalname,
                },
                {
                    new: true,
                    upsert: true,
                    runValidators: true,
                    setDefaultsOnInsert: true,
                }
            );

            // Delete old Cloudinary file only after new upload and DB update succeed
            if (oldResume?.publicId) {
                try {
                    await cloudinary.uploader.destroy(oldResume.publicId, {
                        resource_type: "raw",
                    });
                } catch (deleteError) {
                    console.error(
                        "Could not delete previous resume:",
                        deleteError.message
                    );
                }
            }

            res.status(200).json({
                message: "Resume uploaded successfully",
                resume,
            });
        } catch (error) {
            console.error("Resume upload error:", error);

            res.status(500).json({
                message: "Resume upload failed",
                error: error.message,
            });
        }
    }
);

// Delete current resume (admin only)
router.delete("/", authMiddleware, async (req, res) => {
    try {
        const resume = await Resume.findOne();

        if (!resume) {
            return res.status(404).json({
                message: "No resume found",
            });
        }

        await cloudinary.uploader.destroy(resume.publicId, {
            resource_type: "raw",
        });

        await Resume.deleteOne({ _id: resume._id });

        res.json({
            message: "Resume deleted successfully",
        });
    } catch (error) {
        console.error("Resume delete error:", error);

        res.status(500).json({
            message: "Failed to delete resume",
        });
    }
});

module.exports = router;