const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

// @route   GET api/tasks
// @desc    Get all tasks for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/tasks
// @desc    Create a task
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, description } = req.body;

  try {
    const newTask = new Task({
      user: req.user.id,
      title,
      description
    });

    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, description, completed } = req.body;

  // Build task object
  const taskFields = {};
  if (title) taskFields.title = title;
  if (description) taskFields.description = description;
  if (completed !== undefined) taskFields.completed = completed;

  try {
    let task = await Task.findById(req.params.id);

    // Check if task exists
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    // Check if user owns task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Update task
    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: taskFields },
      { new: true }
    );

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    // Check if task exists
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    // Check if user owns task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Delete task
    await Task.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;