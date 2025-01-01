// // server.js

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bodyParser = require('body-parser');

// const app = express();
// const port = 5001;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // MongoDB connection
// mongoose.connect('mongodb://localhost:27017/tasks', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   console.log('MongoDB connected');
// }).catch((error) => {
//   console.log('MongoDB connection error:', error);
// });

// // Task schema
// const taskSchema = new mongoose.Schema({
//   name: String,
//   location: String,
//   phone: String,
//   date: String,
//   notes: String,
//   taskType: { type: String, required: true }, // taskType
//   priority: { type: String, required: true }, // priority
//   uniqueCode: String,
//   images: [String],
// });

// const Task = mongoose.model('Task', taskSchema);

// // CRUD routes

// // Get all tasks
// app.get('/tasks', async (req, res) => {
//   try {
//     const tasks = await Task.find();
//     res.json(tasks);
//   } catch (err) {
//     res.status(500).send('Server Error');
//   }
// });

// // Add a new task
// app.post('/tasks', async (req, res) => {
//   try {
//     const newTask = new Task(req.body);
//     await newTask.save();
//     res.status(201).json(newTask);
//   } catch (err) {
//     res.status(400).send('Error adding task');
//   }
// });

// // Edit a task
// app.put('/tasks/:id', async (req, res) => {
//   try {
//     const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(updatedTask);
//   } catch (err) {
//     res.status(400).send('Error updating task');
//   }
// });

// // Delete a task
// app.delete('/tasks/:id', async (req, res) => {
//   try {
//     await Task.findByIdAndDelete(req.params.id);
//     res.status(200).send('Task deleted');
//   } catch (err) {
//     res.status(400).send('Error deleting task');
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
