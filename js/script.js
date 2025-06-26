document.addEventListener("DOMContentLoaded", function() {
  var taskForm = document.getElementById("task-form");
  var taskInput = document.getElementById("task-input");
  var taskList = document.getElementById("task-list");

  function loadTasks() {
    fetch("/api/tasks")
      .then(function(response) {
        return response.json();
      })
      .then(function(tasks) {
        taskList.innerHTML = "";
        for (var i = 0; i < tasks.length; i++) {
          var task = tasks[i];
          var li = document.createElement("li");

          var span = document.createElement("span");
          span.textContent = task.title;
          if (task.done === true) {
            span.style.textDecoration = "line-through";
          }
          li.appendChild(span);

          li.addEventListener("click", function(event) {
            toggleTask(task._id);
          }.bind(null, task));

          var delBtn = document.createElement("button");
          delBtn.textContent = "Delete Task";
          delBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          deleteTask(task._id);
          });

          li.appendChild(delBtn);
          taskList.appendChild(li);
        }
      })
      .catch(function(error) {
        console.error("Error loading tasks:", error);
      });
  }

  function addTask(title) {
    fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title })
    })
      .then(function() {
        loadTasks();
      })
      .catch(function(error) {
        console.error("Error adding task:", error);
      });
  }

  function toggleTask(id) {
    fetch("/api/tasks/" + id, { method: "PATCH" })
      .then(function() {
        loadTasks();
      })
      .catch(function(error) {
        console.error("Error toggling task:", error);
      });
  }

  function deleteTask(id) {
    fetch("/api/tasks/" + id, { method: "DELETE" })
      .then(function() {
        loadTasks();
      })
      .catch(function(error) {
        console.error("Error deleting task:", error);
      });
  }

  taskForm.addEventListener("submit", function(event) {
    event.preventDefault();
    var title = taskInput.value.trim();
    if (title.length > 0) {
      addTask(title);
      taskInput.value = "";
    }
  });

  loadTasks();
});