const router = require("express").Router();
const User = require("../model/userModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require('../utils/verifyToken')
const { registerValidation, loginValidation } = require("../utils/validation");

router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists)
    return res.status(400).send({ msg: "The email provided already exists." });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = {
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  };
  User.create(user)
    .then((doc) => {
      const token = jwt.sign({ _id: doc._id }, process.env.TOKEN_SECRET);
      return res.header("access-token", token).status(200).send({ user: doc });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(401).send({ msg: "Email or password is incorrect." });

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass)
    return res.status(401).send({ msg: "Email or password is incorrect." });

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

  return res
    .header("access-token", token)
    .status(200)
    .send({ msg: `Welcome back ${user.name}!` });
});

router.delete("/:id", auth, (req, res) => {
  User.deleteOne({ _id: req.user._id })
    .then(() =>
      res
        .status(200)
        .send({ msg: `User [${req.user._id}] was deleted successfully.` })
    )
    .catch((err) => res.status(500).send(err));
});

module.exports = router;
