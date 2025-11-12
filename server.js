// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// connect MongoDB (local)
mongoose.connect("mongodb://127.0.0.1:27017/simpleusers", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  fullname: String,
  age: Number,
  mobile: String,
  gender: String,
});

const User = mongoose.model("User", UserSchema);

// Register route
app.post("/api/register", async (req, res) => {
  const { username, password, fullname, age, mobile, gender } = req.body;

  const exist = await User.findOne({ username });
  if (exist) return res.json({ success: false, message: "Username already exists" });

  const user = new User({ username, password, fullname, age, mobile, gender });
  await user.save();
  res.json({ success: true });
});

// Login route
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (!user) return res.json({ success: false, message: "Invalid credentials" });
  res.json({ success: true });
});

// Get user data
app.get("/api/user/:username", async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  res.json(user);
});

// Update user
app.put("/api/user/:username", async (req, res) => {
  await User.updateOne({ username: req.params.username }, req.body);
  res.json({ message: "User updated successfully" });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
