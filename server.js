const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes");
const noteRoutes = require("./src/routes/noteRoutes");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const helmet = require("helmet");

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());

// 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use("/api/", limiter);
app.use("/api/auth", authRoutes);
app.use("/api", noteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
