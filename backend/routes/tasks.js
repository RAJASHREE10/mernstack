const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// CREATE a task
router.post('/', async (req, res) => {
  const { title } = req.body;
  try {
    const newTask = new Task({ title });
    const savedTask = await newTask.save();
    res.json(savedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// READ all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get tasks' });
  }
});

// UPDATE a task
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, completed },
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE a task
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Task.findByIdAndDelete(id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
