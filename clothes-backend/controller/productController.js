const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const binary = require("mongodb").Binary;

let products = require("../model/productModel.js");

const router = express.Router();

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

const upload = multer({
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

router.post("/", (req, res) => {
  products
    .create(req.body)
    .then((doc) =>
      res
        .status(201)
        .send({ msg: `${doc.name} - [${doc.code}] was created successfully.` })
    )
    .catch((err) => {
      err.code === 11000
        ? res.status(409).send({ msg: `${req.body.code} already exists.` })
        : res.status(500).send(err);
    });
});

router.put("/images/:code", upload.array("files"), (req, res) => {
  if (!req.files)
    return res.status(422).send({ msg: "No files have been uploaded." });
  let offset = 0,
    filesCtr = req.files.length;
  return new Promise((resolve, reject) =>
    req.files
      .map((file) => ({
        name: file.originalname,
        data: fs.readFileSync(file.path),
      }))
      .forEach((file) => {
        console.log(file)
        setTimeout(() => {
          products
            .findOneAndUpdate(
              { code: req.params.code },
              { $set: { "images.$[elem].data": file.data } },
              {
                new: true,
                useFindAndModify: false,
                arrayFilters: [{ "elem.data": null, "elem.name": file.name }],
              }
            )
            .catch((err) => res.status(500).send({ msg: `${err}` }));
        }, 100 + offset);
        offset += 100;
        filesCtr--;
        if (filesCtr === 0)
          resolve(res.status(200).send({ msg: "All files uploaded" }));
      })
  );
});

router.put("/:code", (req, res) => {
  products
    .findOneAndUpdate({ code: req.params.code }, req.body, { new: true })
    .then((doc) => {
      console.log(doc)
      return doc
        ? res.status(200).send({ msg: `${doc.name} - [${doc.code}] was edited successfully.` })
        : res.status(404).send({ msg: `${req.params.code} does not exist.` })
    }
    )
    .catch((err) => res.status(500).send(err));
});

router.get("/", (req, res) => {
  products
    .find()
    .then((docs) => res.status(200).send(docs))
    .catch((err) => res.status(500).send(err));
});

router.get("/:code", (req, res) => {
  products
    .findOne({ code: req.params.code })
    .then((doc) => {
      doc
        ? res.status(200).send(doc)
        : res.status(404).send({ msg: `${req.params.code} does not exist.` });
    })
    .catch((err) => res.status(500).send(err));
});

router.delete("/:code", (req, res) => {
  products
    .deleteOne({ code: req.params.code })
    .then((err) => {
      err.deletedCount === 0
        ? res.status(404).send({ msg: `${req.params.code} does not exist.` })
        : res
            .status(200)
            .send({ msg: `[${req.params.code}] was deleted successfully.` });
    })
    .catch((err) => res.status(500).send(err));
});

module.exports = router;
