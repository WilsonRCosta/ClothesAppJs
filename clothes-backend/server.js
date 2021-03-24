let express = require("express");
let mongoose = require("mongoose");
let Cors = require("cors");

let productsController = require("./controller/productController.js");
let usersController = require("./controller/userController.js");

// App config
const app = express();
const port = process.env.PORT || 8000;
const connection_url = "mongodb://localhost:27017/clothes-db";

// Middleware
app.use(express.json());
app.use(Cors());
app.use("/api/products", productsController);
//app.use("/api/users", usersController);
app.use('/public', express.static('public'));

// DB Config
mongoose
  .connect(connection_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(
    () => console.log("Database successfully connected"),
    (reason) => console.log("Database could not be connected: " + reason)
  );

// Listener
app.listen(port, () => console.log(`Server listening on port ${port}`));
