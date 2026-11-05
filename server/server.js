
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const memoryRoutes = require("./routes/memories");

const app = express();

app.use(cors());
app.use(express.json({ limit: "8mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/memories", memoryRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Memora API!");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Memora server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error.message);
  });
