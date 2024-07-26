const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const Redis = require('ioredis');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { connection } = require('./config/db');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        // origin: "http://localhost:3000", // Frontend URL
        origin: "https://harmonious-begonia-acfecd.netlify.app/",
        methods: ["GET", "POST"]
    }
});

const redis = new Redis({
    port: 12675,
    host: 'redis-12675.c212.ap-south-1-1.ec2.cloud.redislabs.com',
    username: '',
    password: 'dssYpBnYQrl01GbCGVhVq2e4dYvUrKJB'
});

const taskSchema = new mongoose.Schema({
    task: String
});

const Task = mongoose.model('assignment_rajiv', taskSchema);

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('get data');
});

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('add', async (task) => {
        let tasks = await redis.get('FULLSTACK_TASK_rajiv');
        tasks = tasks ? JSON.parse(tasks) : [];
        tasks.push(task);

        if (tasks.length > 50) {
            await Task.insertMany(tasks.map(task => ({ task })));
            tasks = [];
        }

        await redis.set('FULLSTACK_TASK_rajiv', JSON.stringify(tasks));
        io.emit('tasks', tasks); // Emit to all clients
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

app.get('/fetchAllTasks', async (req, res) => {
    let tasks = await redis.get('FULLSTACK_TASK_rajiv');
    tasks = tasks ? JSON.parse(tasks) : [];
    res.json(tasks);
});

const PORT = process.env.PORT || 6001;

server.listen(PORT, async () => {
    try {
        await connection;
        console.log("connected to DB");
    } catch (err) {
        console.log("not connected to db");
        console.log(err);
    }
    console.log(`Server running on port ${PORT}`);
});
