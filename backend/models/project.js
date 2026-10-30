const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    techstack: {
      type: [String],
      required: true,
    },

    imageUrl: {
      type: String,
      default: "./public/images/default.webp",
    },
    githubURL: {
      type: String,
    },
    liveURL: {
      type: String,
    },

    githubURL: { type: String },
    liveURL: { type: String },
    blogURL: { type: String },
    youtubeURL: { type: String },

    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
