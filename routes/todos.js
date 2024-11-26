const express = require("express");
const Todo = require("../models/Todo");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  const { title, description, isPublic } = req.body;
  try {
    const todo = new Todo({ title, description, isPublic, userId: req.user.userId });
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({
      $or: [{ userId: req.user.userId }, { isPublic: true }],
    });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;