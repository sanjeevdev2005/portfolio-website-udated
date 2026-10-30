const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
    {
        fileUrl: {
            type: String,
            required: true,
        },
        publicId: {
            type: String,
            required: true,
        },
        fileName: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;