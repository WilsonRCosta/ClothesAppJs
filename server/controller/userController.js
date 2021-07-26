const router = require("express").Router();
const User = require("../model/userModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../utils/verifyToken");
const { registerValidation, loginValidation } = require("../utils/validation");

router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists)
    return res.status(400).json({ msg: "The email provided already exists." });

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
      return res
        .header("token", token)
        .status(200)
        .json({
          user: user.name,
          msg: `User ${user.name} created successfully!`,
        });
    })
    .catch((err) => {
      res.status(400).json({ msg: err });
    });
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });
  try {
    let user = await User.findOne({ name: req.body.name });
    if (!user)
      return res
        .status(401)
        .json({ msg: "Username or password is incorrect." });
    await bcrypt.compare(req.body.password, user.password);
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res
      .header("token", token)
      .status(200)
      .json({ user: user.name, msg: `Welcome back ${user.name}!` });
  } catch (err) {
    res.status(401).json({ msg: "Username or password is incorrect." });
  }
});

router.delete("/:id", auth, (req, res) => {
  User.deleteOne({ _id: req.user._id })
    .then(() =>
      res
        .status(200)
        .json({ msg: `User [${req.user._id}] was deleted successfully.` })
    )
    .catch((err) => res.status(500).json({ msg: err }));
});

module.exports = router;
