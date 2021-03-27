let express = require("express");
let mongoose = require("mongoose");
let Cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

let productsController = require("./controller/productController.js");
let usersController = require("./controller/userController.js");

// App config
const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(Cors());
app.use("/api/products", productsController);
app.use("/api/auth", usersController);
app.use("/public", express.static("public"));

//Local DB
const connection_url = "mongodb://localhost:27017/clothes-db";

// DB Config
mongoose.connect(
  process.env.DB_CONNECT, //connection_url,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  (err) =>
    err
      ? console.log("ERROR: Database not connected: " + err)
      : console.log("Database connected")
);

// Listener
app.listen(port, () => console.log(`Server listening on port ${port}`));

