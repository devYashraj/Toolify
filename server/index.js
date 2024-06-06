const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const CreateRouter = require('./Routes/CreateRouter')
const RetrieveRouter = require('./Routes/RetrieveRouter');
const { authenticateToken } = require('./utils');
const UpdateRouter = require('./Routes/UpdateRouter');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/sintdb");
        console.log("Connected to database successfully");
    }
    catch (error) {
        console.log(error);
    }
}

connectDB();

app.use("/api/sint/create", CreateRouter);

app.use("/api/sint/retrieve", RetrieveRouter);

app.use("/api/sint/update", UpdateRouter);

app.get("/api/verifytoken", authenticateToken, (req, res) => {
    res.status(200).json({ message: "YAY TOKEN Verified. This is a secret" });
})

app.use(express.static(path.join(__dirname, '..', 'sintefy-app', 'dist')));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'sintefy-app', 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Listening on Port", PORT);
});