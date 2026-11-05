
const express = require("express");
const jwt = require("jsonwebtoken");
const Memory = require("../models/Memory");

const router = express.Router();

// Verify login
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Please login first" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Save memory
router.post("/", verifyToken, async (req, res) => {
  try {
    const { text, date, mood, image } = req.body;

    if (!text || !date) {
      return res.status(400).json({
        message: "Text and date are required"
      });
    }

    const memory = await Memory.create({
      userId: req.userId,
      text,
      date,
      mood: mood || "😊",
      image: image || "",
      isFavorite: false
    });

    res.status(201).json({
      message: "Memory saved successfully",
      memory
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not save memory"
    });
  }
});

// Get memories
router.get("/", verifyToken, async (req, res) => {
  try {
    const memories = await Memory.find({
      userId: req.userId
    }).sort({ createdAt: -1 });

    res.json(memories);
  } catch (error) {
    res.status(500).json({
      message: "Could not fetch memories"
    });
  }
});

// Edit memory or update favourite
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updates = {};
    const allowedFields = [
      "text",
      "date",
      "mood",
      "image",
      "isFavorite"
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const memory = await Memory.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId
      },
      { $set: updates },
      {
  returnDocument: "after",
  runValidators: true
}
    );

    if (!memory) {
      return res.status(404).json({
        message: "Memory not found"
      });
    }

    res.json({
      message: "Memory updated successfully",
      memory
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not update memory"
    });
  }
});

// Delete memory
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const memory = await Memory.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!memory) {
      return res.status(404).json({
        message: "Memory not found"
      });
    }

    res.json({
      message: "Memory deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not delete memory"
    });
  }
});

module.exports = router;
