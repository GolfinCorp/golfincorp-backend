const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// Swagger docs
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
// Routes
const userRoutes = require("./routes/users");
const clubRoutes = require("./routes/clubs");
const memberRoutes = require("./routes/members");
const gameRoutes = require("./routes/games");
require("dotenv").config();

// Express app declaration
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		app.listen(process.env.PORT || 8080, () => {
			console.log("server is listening on port 8080");
		});
	})
	.catch((err) => console.log(Error));

app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Base Routes
app.use("/api/users", userRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/games", gameRoutes);
