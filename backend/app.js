require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Import the news routes
const newsRoutes = require("./apiRoute/api");

// Use the /api prefix for all news routes
app.use("/api", newsRoutes);

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
