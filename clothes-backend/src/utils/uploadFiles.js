const multer = require("multer");
const path = require("path");
const binary = require("mongodb").Binary;

const FILE_LIMIT = 1024 * 1024 * 15; // 15MB
const FILES_DIR = "./public/images/";
const allowedTypes = ["image/png", "image/jpg", "image/gif", "image/jpeg"];

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, FILES_DIR); // TODO: use code to create the dirs
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const uploadFile = multer({
  storage: storage,
  limits: FILE_LIMIT,
  fileFilter: (req, file, callback) => {
    if (allowedTypes.indexOf(file.mimetype) === -1)
      return callback(
        new Error(`File format not allowed: ${file.mimetype}`),
        false
      );
    callback(null, true);
  },
});

module.exports = uploadFile;
