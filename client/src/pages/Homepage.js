import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// const socket = io('http://localhost:1024'); // Ensure this matches the server port
// const socket = io('https://fullstack-task-rajiv.vercel.app/')
const socket = io('https://fullstack-task-rajiv.onrender.com/')

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
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div>
                        <img 
                            src="https://via.placeholder.com/50" 
                            alt="Placeholder" 
                            style={{ width: '50px', height: '50px' }}
                        />
                    </div>
                    <div style={{ fontWeight: 'bolder', paddingTop: '3%' }}>Note App</div>
                </div>
            </header>
            <main>
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="New Note..."
                />
                <button onClick={addTask}>+ Add</button>
                <h2>Notes</h2>
                <div className="notes-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <ul>
                        {tasks.map((task, index) => (
                            <li key={index}>{task}</li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
};

export default Homepage;
    