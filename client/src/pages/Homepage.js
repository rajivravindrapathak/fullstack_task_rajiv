import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:1024'); // Ensure this matches the server port

const Homepage = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        socket.on('tasks', (tasks) => {
            setTasks(tasks);
        });

        // Cleanup on unmount
        return () => {
            socket.off('tasks');
        };
    }, []);

    const addTask = () => {
        socket.emit('add', newTask);
        setNewTask('');
    };

    return (
        <div className="Homepage">
            <header>
                <h1>To-Do List</h1>
            </header>
            <main>
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task"
                />
                <button onClick={addTask}>Add</button>
                <ul>
                    {tasks.map((task, index) => (
                        <li key={index}>{task}</li>
                    ))}
                </ul>
            </main>
        </div>
    );
};

export default Homepage;
