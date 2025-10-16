const express=require('express');
const router=express.Router();
const {user}=require("../controller/user")
const Task = require("../models/user");

router.post("/tasks",user)


//update task
router.patch('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) return res.status(404).send("Task not found");
        res.send({message:task.completed?"Task marked as Complted":"Task marked as incomplete",task});
    } catch (err) {
        res.status(500).send(err);
    }
});


// Delete task
router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).send("Task not found");
        res.send({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).send(err);
    }
});

//get tasks
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find(); // fetch all tasks from DB
        res.send(tasks); // send array of tasks
    } catch (err) {
        res.status(500).send(err);
    }
});


// Edit task
router.put("/tasks/:id", async (req, res) => {
    try {
        const { todo } = req.body; // new task text

        // Validate input
        if (!todo || todo.trim() === "") {
            return res.status(400).send({ message: "Task cannot be empty" });
        }

        // Update task in DB
        const task = await Task.findByIdAndUpdate(
            req.params.id,   // task ID from URL
            { todo },        // new task text
            { new: true }    // return updated task
        );

        if (!task) return res.status(404).send({ message: "Task not found" });

        res.send({
            message: "Task updated successfully",
            task
        });
    } catch (err) {
        console.error("Error updating task:", err);
        res.status(500).send({ message: "Internal Server Error", error: err });
    }
});

module.exports=router
