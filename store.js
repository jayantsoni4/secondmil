// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Environment variables (for MongoDB URI)
const PORT = process.env.PORT || 5000;
const MONGO_URI = "mongodb+srv://khushsoni839:ks1234@cluster0.u3hib.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Replace <username>, <password>, and <cluster> with your MongoDB Atlas credentials

const app = express();
app.use(cors());
app.use(express.json());

// Mongoose Schema & Model
const inventorySchema = new mongoose.Schema({
  date: String,
  partCode: String,
  product: String,
  model: String,
  capacity: String,
  currentStock: Number,
  stockIn: Number,
  stockOut: Number,
  total: Number,
});

const Inventory = mongoose.model("Inventory", inventorySchema);

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// === API Routes ===

// Get all inventory items
app.get("/api/inventory", async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new inventory item
app.post("/api/inventory", async (req, res) => {
  try {
    const newItem = new Inventory(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update an item by ID
app.put("/api/inventory/:id", async (req, res) => {
  try {
    const updatedItem = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an item by ID
app.delete("/api/inventory/:id", async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
