const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes");
const noteRoutes = require("./src/routes/noteRoutes");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});
mongoose.connection.on("error", (err) => {
  console.error(err);
});

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());

//I Assumed the rate limit is 100 requests per 10 minutes
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});

app.use("/api/", limiter);
app.use("/auth", authRoutes);
app.use("/api", noteRoutes.router);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = server;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OTU1MDNlMTJjZjAxY2EzMTFjNjA4MSIsImlhdCI6MTcwNDI4NDIyMn0.H4xnknlm0F0eXaLNXZZFVks87XyKH6YUfbOG2YrYiLo
