'use strict';
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 80;
const DATA_FILE = path.join(__dirname, 'data', 'posts.json');

// Middleware
app.use(express.json()); // To parse JSON bodies 
app.use(express.static('public')); // Serve frontend files from public/ 

// Ensure data directory and file exist 
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// Helper to load posts 
function loadPosts() {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
}

// Helper to save posts 
function savePosts(posts) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));
}

// GET /api/posts - Returns all posts 
app.get('/api/posts', (req, res) => {
    const posts = loadPosts();
    res.json(posts);
});

// POST /api/posts - Creates a post 
app.post('/api/posts', (req, res) => {
    const { topic, data } = req.body;
    
    // VALIDATION GUARD: This prevents the server from crashing or saving empty data
    if (!topic || !data || topic.trim() === "" || data.trim() === "") {
        console.log("Bad Request: Missing topic or data");
        return res.status(400).json({ error: "Topic and data are required." });
    }

    const posts = loadPosts();
    const newPost = {
        topic: topic,
        data: data,
        timestamp: new Date().toISOString() // ISO format 
    };

    posts.push(newPost);
    savePosts(posts); // Write to file every time a new post is created 
    
    res.status(201).json({ message: 'Post created!', post: newPost });
});

app.listen(PORT, () => {
    console.log(`Server up and running on http://localhost:${PORT}`);
});