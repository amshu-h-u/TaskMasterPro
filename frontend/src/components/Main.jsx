import React, { useState, useEffect } from 'react';
import axios from "axios";

export default function Main() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [editingIndex, setEditingIndex] = useState(null); // track which task is being edited

    // Fetch all tasks on page load
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await axios.get("http://localhost:8080/tasks");
                const mappedTasks = res.data.map(task => ({
                    ...task,
                    text: task.todo
                }));
                setTasks(mappedTasks);
            } catch (err) {
                console.error("Error fetching tasks:", err);
            }
        }
        fetchTasks();
    }, []);

    // Add new task
    const addTask = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        try {
            const res = await axios.post("http://localhost:8080/tasks", { 
                todo: newTask, 
                completed: false 
            });
            setTasks([...tasks, { ...res.data, text: res.data.todo }]);
            setNewTask('');
        } catch (err) {
            console.error("Error adding task:", err);
        }
    }

    // Toggle completed status
    const toggleTask = async (index) => {
        const task = tasks[index];
        try {
            const res = await axios.patch(`http://localhost:8080/tasks/${task._id}`, {
                completed: !task.completed
            });
            alert(res.data.message);
            const updatedTasks = tasks.map((t, i) =>
                i === index ? { ...t, completed: res.data.task.completed } : t
            );
            setTasks(updatedTasks);
        } catch (err) {
            console.error("Error updating task:", err);
        }
    };

    // Delete task
    const deleteTask = async (index) => {
        const task = tasks[index];
        try {
            const res = await axios.delete(`http://localhost:8080/tasks/${task._id}`);
            const updatedTasks = tasks.filter((_, i) => i !== index);
            setTasks(updatedTasks);
            alert(res.data.message);
        } catch (err) {
            console.error("Error deleting task:", err);
        }
    };

    // Start editing a task
    const startEditing = (index) => {
        setEditingIndex(index);
        setNewTask(tasks[index].text); // populate input with current task text
    }


    // Save edited task
    const editTask = async () => {
        if (editingIndex === null) return;

        const task = tasks[editingIndex];
        if (!newTask.trim()) return;

        try {
            const res = await axios.put(`http://localhost:8080/tasks/${task._id}`, {
                todo: newTask
            });
            const updatedTasks = tasks.map((t, i) =>
                i === editingIndex ? { ...t, todo: res.data.task.todo, text: res.data.task.todo } : t
            );
            setTasks(updatedTasks);
            setNewTask('');
            setEditingIndex(null);
            alert(res.data.message);
        } catch (err) {
            console.error("Error editing task:", err);
        }
    }

    return (
        <div>
            <h1 className='text-center bg-teal-700 text-white p-3 font-bold'>My Own To-Do App</h1>

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
    )
}
