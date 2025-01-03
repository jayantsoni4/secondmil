const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
// import { v4 as uuidv4 } from 'uuid';



const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

let tasks = []; // Temporary in-memory data store

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${uuidv4()}-${file.originalname}`),
});
const upload = multer({ storage });

// Get all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Add a new task
app.post('/tasks', upload.array('images', 10), (req, res) => {
  const { name, location, phone, date, notes, option, options } = req.body;
  const images = req.files.map((file) => file.filename);
  const newTask = {
    id: uuidv4(),
    name,
    location,
    phone,
    date,
    notes,
    option,
    options,
    images,
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Update a task
app.put('/tasks/:id', upload.array('images', 10), (req, res) => {
  const { id } = req.params;
  const { name, location, phone, date, notes, option, options } = req.body;
  const images = req.files.map((file) => file.filename);

  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex === -1) return res.status(404).json({ error: 'Task not found' });

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    name,
    location,
    phone,
    date,
    notes,
    option,
    options,
    images: images.length ? images : tasks[taskIndex].images,
  };

  res.json(tasks[taskIndex]);
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter((task) => task.id !== id);
  res.status(204).send();
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
