const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5006;
const connectDb = require("./config/dbConnection");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static('/home/lawliet/college-portfolio/Portfolio-Frontend')); // e.g., /frontend folder


app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/search", require("./routes/searchRoutes"));
app.use("/api/connections", require("./routes/connectionRoutes"));

// Error handler middleware (must be after all routes)
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

const startServer = async () => {
    try {
        await connectDb();
        
        const PORT = process.env.PORT || 5002;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Server startup failed:', error);
        process.exit(1);
    }
};

startServer();