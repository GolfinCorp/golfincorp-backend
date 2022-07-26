const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/users");
const clubRoutes = require("./routes/clubs");
const memberRoutes = require("./routes/members");

require("dotenv").config();

// Express app declaration
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(8080, () => {
      console.log("server is listening on port 8080");
    });
  })
  .catch((err) => console.log(Error));

// for parsing application/json
app.use(bodyParser.json());

// Base Routes
app.use("/api/users", userRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/members", memberRoutes);
