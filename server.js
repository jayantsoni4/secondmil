const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();  // Import dotenv to read environment variables

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas connection
const mongoURI = process.env.MONGODB_URI; // Make sure to set your MongoDB URI in .env

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((error) => {
  console.log('MongoDB connection error:', error);
});

// Task schema
const taskSchema = new mongoose.Schema({
  name: String,
  location: String,
  phone: String,
  date: String,
  notes: String,
  images: [String],
});

const Task = mongoose.model('Task', taskSchema);

// CRUD routes

// Get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Add a new task
app.post('/tasks', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).send('Error adding task');
  }
});

// Edit a task
app.put('/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (err) {
    res.status(400).send('Error updating task');
  }
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).send('Task deleted');
  } catch (err) {
    res.status(400).send('Error deleting task');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
