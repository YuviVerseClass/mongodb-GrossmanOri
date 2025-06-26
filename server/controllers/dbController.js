const Task = require('../models/Task');

function getTasks(req, res) {
  Task.find()
    .then(tasks => res.json(tasks))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Error fetching tasks' });
    });
}

function addTask(req, res) {
  const { title } = req.body;
  const newTask = new Task({ title });

  newTask.save()
    .then(task => res.json(task))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Error saving task' });
    });
}

function toggleTask(req, res) {
  Task.findById(req.params.id)
    .then(task => {
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      task.done = !task.done;
      return task.save();
    })
    .then(updatedTask => res.json(updatedTask))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Error toggling task' });
    });
}

function deleteTask(req, res) {
  Task.findByIdAndDelete(req.params.id)
    .then(task => {
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json({ message: 'Task deleted', task });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Error deleting task' });
    });
}

module.exports = {
  getTasks,
  addTask,
  toggleTask,
  deleteTask,
};