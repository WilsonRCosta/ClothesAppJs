const express = require("express"),
    mongoose = require("mongoose"),
    path = require("path"),
    dotenv = require("dotenv"),
    swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json'),
    productsController = require("./controller/product-controller.js"),
    usersController = require("./controller/user-controller.js");

dotenv.config();

// App config
const app = express();
const port = process.env.PORT || 8001;

// Middleware
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.json());
app.use("/api/products", productsController);
app.use("/api/auth", usersController);
app.use("/public", express.static("public"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// DB Config
mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  (err) =>
    err
      ? console.log("Database not connected!\n" + err)
      : console.log("Database connected")
);

// Listener
app.listen(port, (err) =>
  console.log(err ? err : `Server running on port ${port}...`)
);
