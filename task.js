require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON data
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.static("public")); // Serve static files

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => {
    console.error("Error connecting to MongoDB Atlas:", error);
    process.exit(1); // Exit if connection fails
  });

// Define a schema and model for tasks
const taskSchema = new mongoose.Schema({
  task: { type: String, required: true },
});

const Task = mongoose.model("server", taskSchema);

// Serve the main page
app.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>To-Do App</title>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          .container {
            width: 80%;
            margin: auto;
            text-align: center;
          }
          form {
            margin: 20px 0;
          }
          ul {
            list-style-type: none;
            padding: 0;
          }
          li {
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>To-Do App</h1>
          <form action="/add" method="POST">
            <input type="text" name="task" placeholder="Enter a new task" required />
            <button type="submit">Add Task</button>
          </form>
          <ul>
            ${tasks
              .map(
                (task) => `
                <li>
                  ${task.task}
                  <form action="/delete" method="POST" style="display: inline;">
                    <input type="hidden" name="id" value="${task._id}" />
                    <button type="submit" class="delete">Delete</button>
                  </form>
                </li>
              `
              )
              .join("")}
          </ul>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send("Error loading tasks.");
  }
});

// Add a new task
app.post("/add", async (req, res) => {
  try {
    const { task } = req.body;
    if (!task) return res.status(400).send("Task cannot be empty.");
    const newTask = new Task({ task });
    await newTask.save();
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error adding task.");
  }
});

// Delete a task
app.post("/delete", async (req, res) => {
  try { 
    const { id } = req.body;
    if (!id) return res.status(400).send("Task ID is required.");
    await Task.findByIdAndDelete(id);
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error deleting task.");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
