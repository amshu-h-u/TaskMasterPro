import React, { useState, useEffect } from 'react';
import axios from "axios";

export default function Main() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);

    // ✅ Use environment variable for base URL
    const API_BASE_URL = import.meta.env.VITE_API_URL || "";

    // Fetch all tasks on page load
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/tasks`);
                const mappedTasks = res.data.map(task => ({
                    ...task,
                    text: task.todo
                }));
                setTasks(mappedTasks);
            } catch (err) {
                console.error("❌ Error fetching tasks:", err);
            }
        };
        fetchTasks();
    }, [API_BASE_URL]);

    // Add new task
    const addTask = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        try {
            const res = await axios.post(`${API_BASE_URL}/api/tasks`, { 
                todo: newTask, 
                completed: false 
            });
            setTasks([...tasks, { ...res.data.task, text: res.data.task.todo }]);
            setNewTask('');
        } catch (err) {
            console.error("❌ Error adding task:", err);
        }
    };

    // Toggle completed status
    const toggleTask = async (index) => {
        const task = tasks[index];
        try {
            const res = await axios.patch(`${API_BASE_URL}/api/tasks/${task._id}`, {
                completed: !task.completed
            });
            const updatedTasks = tasks.map((t, i) =>
                i === index ? { ...t, completed: res.data.task.completed } : t
            );
            setTasks(updatedTasks);
        } catch (err) {
            console.error("❌ Error updating task:", err);
        }
    };

    // Delete task
    const deleteTask = async (index) => {
        const task = tasks[index];
        try {
            await axios.delete(`${API_BASE_URL}/api/tasks/${task._id}`);
            setTasks(tasks.filter((_, i) => i !== index));
        } catch (err) {
            console.error("❌ Error deleting task:", err);
        }
    };

    // Start editing a task
    const startEditing = (index) => {
        setEditingIndex(index);
        setNewTask(tasks[index].text);
    };

    // Save edited task
    const editTask = async () => {
        if (editingIndex === null || !newTask.trim()) return;

        const task = tasks[editingIndex];
        try {
            const res = await axios.put(`${API_BASE_URL}/api/tasks/${task._id}`, {
                todo: newTask
            });
            const updatedTasks = tasks.map((t, i) =>
                i === editingIndex ? { ...t, todo: res.data.task.todo, text: res.data.task.todo } : t
            );
            setTasks(updatedTasks);
            setNewTask('');
            setEditingIndex(null);
        } catch (err) {
            console.error("❌ Error editing task:", err);
        }
    };

    return (
        <div>
            <h1 className='text-center bg-teal-700 text-white p-3 font-bold'>
                My Own To-Do App
            </h1>

            <div className='flex justify-center items-center'>
                <input
                    className='p-3 border-2 border-black rounded-xl w-1/2'
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder='Enter Your To-Do Task!'
                />
                {editingIndex === null ? (
                    <button
                        className='p-3 m-3 w-[150px] bg-green-500 rounded-xl hover:bg-green-200'
                        onClick={addTask}
                    >
                        Submit
                    </button>
                ) : (
                    <button
                        className='p-3 m-3 w-[150px] bg-blue-500 rounded-xl hover:bg-blue-200'
                        onClick={editTask}
                    >
                        Save
                    </button>
                )}
            </div>

            <ul className='p-0 m-5'>
                {tasks.map((task, id) => (
                    <li
                        key={id}
                        className={`flex justify-between items-center p-2 m-2 rounded-xl text-center cursor-pointer ${
                            task.completed ? 'bg-green-600' : 'bg-red-500'
                        }`}
                    >
                        <span
                            className={`font-bold ${task.completed ? 'line-through' : ''}`}
                            onClick={() => toggleTask(id)}
                        >
                            {task.text}
                        </span>
                        <div>
                            <button
                                className='p-2 m-2 border-white border-2 rounded-xl bg-yellow-400'
                                onClick={() => startEditing(id)}
                            >
                                Edit
                            </button>
                            <button
                                className='p-2 m-2 border-white border-2 rounded-xl bg-red-600'
                                onClick={() => deleteTask(id)}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
