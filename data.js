// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Initialize the app
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files for CSS

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/todoAppDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema and model for tasks
const taskSchema = new mongoose.Schema({
  task: String,
});

const Task = mongoose.model("Task", taskSchema);

// Serve the main page
app.get("/", async (req, res) => {
  try {
    const tasks = await Task.find(); // Fetch tasks from the database
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
            background-color: #f4f4f9;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 0;
            padding: 20px;
          }
          .container {
            width: 100%;
            max-width: 500px;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #333;
            text-align: center;
          }
          form {
            margin-bottom: 20px;
          }
          input {
            width: calc(100% - 20px);
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 4px;
          }
          button {
            width: 100%;
            padding: 10px;
            background-color: #007BFF;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          button:hover {
            background-color: #0056b3;
          }
          ul {
            list-style: none;
            padding: 0;
          }
          li {
            background: #f9f9f9;
            margin: 5px 0;
            padding: 10px;
            border-radius: 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border: 1px solid #ddd;
          }
          .delete {
            background: red;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
          }
          .delete:hover {
            background: darkred;
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
                  <form action="/delete" method="POST" style="margin: 0;">
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
