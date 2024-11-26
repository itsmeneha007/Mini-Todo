require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todos");

const app = express();

app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);

connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});