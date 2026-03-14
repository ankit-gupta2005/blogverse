const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const blogRoutes = require("./routes/blogRoutes")

const connectDB = require("./config/db");
const commentRoutes = require("./routes/commentRoutes");

const app = express();

connectDB(); 

app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes)
app.use("/api/user",userRoutes)
app.use("/api/blog",blogRoutes)
app.use("/api/comment", commentRoutes);


module.exports = app;
