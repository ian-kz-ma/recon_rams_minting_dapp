// server/index.js

const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3001;
const merkle = require('./merkleTree.js');

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

//MUST BE BEFORE app.listen STATEMENT - Handle GET requests to /api route
app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.get("/api/merkle", (req, res) => {
    res.json({ message: merkle.getMerkleInfo(req.query.address) });
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});



