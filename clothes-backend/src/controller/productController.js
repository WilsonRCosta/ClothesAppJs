const router = require("express").Router();
const fs = require("fs");
const auth = require("../utils/verifyToken");
const upload = require("../utils/uploadFiles");
const binary = require("mongodb").Binary;

const products = require("../model/productModel.js");
const users = require("../model/userModel.js");

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

router.post("/", auth, async (req, res) => {
  if (!(await isAdmin(req.user._id)))
    return res.status(401).send({
      msg: `User ${req.user._id} is not authorized to add new products.`,
    });
  products
    .create(req.body)
    .then((doc) =>
      res.status(201).send({
        msg: `${doc.name} - [${doc.code}] was created successfully.`,
      })
    )
    .catch((err) => {
      err.code === 11000
        ? res.status(409).send({ msg: `${req.body.code} already exists.` })
        : res.status(500).send(err);
    });
});

router.put("/:code/images", upload.array("files"), auth, async (req, res) => {
  if (!(await isAdmin(req.user._id)))
    return res.status(401).send({
      msg: `User ${req.user._id} is not authorized to add images to products.`,
    });
  let offset = 0,
    filesCtr = req.files.length;
  if (!req.files)
    return res.status(422).send({ msg: "No files have been uploaded." });
  return new Promise((resolve, reject) =>
    req.files
      .map((file) => ({
        name: file.originalname,
        data: fs.readFileSync(file.path),
      }))
      .forEach((file) => {
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

router.put("/:code", auth, async (req, res) => {
  if (!(await isAdmin(req.user._id)))
    return res.status(401).send({
      msg: `User ${req.user._id} is not authorized to edit products.`,
    });
  products
    .findOneAndUpdate({ code: req.params.code }, req.body, { new: true })
    .then((doc) => {
      return doc
        ? res.status(200).send({
            msg: `${doc.name} - [${doc.code}] was edited successfully.`,
          })
        : res.status(404).send({ msg: `${req.params.code} does not exist.` });
    })
    .catch((err) => res.status(500).send(err));
});

router.delete("/:code", auth, async (req, res) => {
  if (!(await isAdmin(req.user._id)))
    return res.status(401).send({
      msg: `User ${req.user._id} is not authorized to delete products.`,
    });
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

const isAdmin = async (id) => {
  return await users.findOne({
    _id: id,
    email: "admin@shinningcode.com",
  });
};

module.exports = router;
