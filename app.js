const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

// Swagger UI Express
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./api/documentation/swaggerJSDoc.js");

const voucherRoutes = require("./api/routes/vouchers");
const publisherRoutes = require("./api/routes/publishers");
const userRoutes = require("./api/routes/users");
const gameRoutes = require("./api/routes/game");
const gameKeyRoutes = require("./api/routes/gamekey");

mongoose.connect(process.env.DATABASE_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/vouchers", voucherRoutes);
app.use("/users", userRoutes);
app.use("/publishers", publisherRoutes);
app.use("/game", gameRoutes);
app.use("/gamekey", gameKeyRoutes);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    code: error.status || 500,
    message: error.message
  });
});

module.exports = app;
