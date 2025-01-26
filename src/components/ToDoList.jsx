import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import "./ToDo.css";

const ItemType = {
  TASK: "task",
};

function DraggableTask({ task, index, section, moveTask, transferTask, editTask, deleteTask }) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: ItemType.TASK,
    item: { index, section, task },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, dropRef] = useDrop(() => ({
    accept: ItemType.TASK,
    hover: (draggedItem) => {
      if (draggedItem.section === section && draggedItem.index !== index) {
        moveTask(draggedItem.index, index, section);
        draggedItem.index = index;
      }
    },
    drop: (draggedItem) => {
      if (draggedItem.section !== section) {
        transferTask(draggedItem.index, draggedItem.section, section, draggedItem.task);
      }
    },
  }));

  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleEdit = () => {
    if (editedTask.trim()) {
      editTask(index, section, editedTask.trim());
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={(node) => dragRef(dropRef(node))}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: "8px",
        margin: "4px",
        backgroundColor: isEditing ? "#ffe0b2" : "lightblue",
        border: "1px solid darkblue",
        cursor: "move",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {isEditing ? (
        <>
          <input
            type="text"
            value={editedTask}
            onChange={(e) => setEditedTask(e.target.value)}
            onBlur={handleEdit}
            onKeyDown={(e) => e.key === "Enter" && handleEdit()}
            autoFocus
            style={{ flex: 1, marginRight: "8px" }}
          />
        </>
      ) : (
        <span>{index + 1}. {task}</span>
      )}
      <div>
        <button onClick={() => setIsEditing(true)} style={{ marginRight: "4px" }}>Edit</button>
        <button onClick={() => deleteTask(index, section)}>Delete</button>
      </div>
    </div>
  );
}

function TaskContainer({ title, tasks, section, moveTask, transferTask, editTask, deleteTask }) {
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: ItemType.TASK,
    drop: (draggedItem) => {
      if (draggedItem.section !== section) {
        transferTask(draggedItem.index, draggedItem.section, section, draggedItem.task);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={dropRef}
      className="Paper"
      style={{
        backgroundColor: isOver ? "#d1ffd1" : "#f0f0f0",
        border: "2px dashed #ccc",
        padding: "8px",
        margin: "8px",
      }}
    >
      <div className="Title">
        <h1>{title}</h1>
      </div>
      <div className="Data">
        {tasks.length === 0
          ? "No Tasks"
          : tasks.map((task, index) => (
              <DraggableTask
                key={`${section}-${index}`}
                task={task}
                index={index}
                section={section}
                moveTask={moveTask}
                transferTask={transferTask}
                editTask={editTask}
                deleteTask={deleteTask}
              />
            ))}
      </div>
    </div>
  );
}

const ToDoList = () => {
  const [toDoTasks, setToDoTasks] = useState(() => JSON.parse(localStorage.getItem("toDoTasks")) || []);
  const [inProgressTasks, setInProgressTasks] = useState(() => JSON.parse(localStorage.getItem("inProgressTasks")) || []);
  const [doneTasks, setDoneTasks] = useState(() => JSON.parse(localStorage.getItem("doneTasks")) || []);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    localStorage.setItem("toDoTasks", JSON.stringify(toDoTasks));
    localStorage.setItem("inProgressTasks", JSON.stringify(inProgressTasks));
    localStorage.setItem("doneTasks", JSON.stringify(doneTasks));
  }, [toDoTasks, inProgressTasks, doneTasks]);

  const handleAddTask = () => {
    if (newTask.trim()) {
      setToDoTasks((prev) => [...prev, newTask.trim()]);
      setNewTask("");
    }
  };

  const taskProvider = (section) => {
    switch (section) {
      case "ToDo":
        return toDoTasks;
      case "InProgress":
        return inProgressTasks;
      case "Done":
        return doneTasks;
      default:
        return [];
    }
  };

  const updateTasks = (section, tasks) => {
    switch (section) {
      case "ToDo":
        setToDoTasks(tasks);
        break;
      case "InProgress":
        setInProgressTasks(tasks);
        break;
      case "Done":
        setDoneTasks(tasks);
        break;
      default:
        console.error(`Unknown section: ${section}`);
    }
  };

  const moveTask = (dragIndex, hoverIndex, section) => {
    const tasks = taskProvider(section);
    [tasks[dragIndex], tasks[hoverIndex]] = [tasks[hoverIndex], tasks[dragIndex]];
    updateTasks(section, [...tasks]);
  };

  const transferTask = (dragIndex, fromSection, toSection, task) => {
    const fromTasks = taskProvider(fromSection);
    const toTasks = taskProvider(toSection);

    fromTasks.splice(dragIndex, 1);
    toTasks.push(task);

    updateTasks(fromSection, [...fromTasks]);
    updateTasks(toSection, [...toTasks]);
  };

  const editTask = (index, section, newTask) => {
    const tasks = taskProvider(section);
    tasks[index] = newTask;
    updateTasks(section, [...tasks]);
  };

  const deleteTask = (index, section) => {
    const tasks = taskProvider(section);
    tasks.splice(index, 1);
    updateTasks(section, [...tasks]);
  };

  return (
    <div className="ToDoContainer">
      <h1>Enhanced To-Do List</h1>
      <div className="AddBar">
        <input
          className="Input"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
          onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
        />
        <button className="AddButton" onClick={handleAddTask}>
          Add Task
        </button>
      </div>
      <div className="ProgressSection">
        <TaskContainer
          title="To Do"
          tasks={toDoTasks}
          section="ToDo"
          moveTask={moveTask}
          transferTask={transferTask}
          editTask={editTask}
          deleteTask={deleteTask}
        />
        <TaskContainer
          title="In Progress"
          tasks={inProgressTasks}
          section="InProgress"
          moveTask={moveTask}
          transferTask={transferTask}
          editTask={editTask}
          deleteTask={deleteTask}
        />
        <TaskContainer
          title="Done"
          tasks={doneTasks}
          section="Done"
          moveTask={moveTask}
          transferTask={transferTask}
          editTask={editTask}
          deleteTask={deleteTask}
        />
      </div>
    </div>
  );
};

export default ToDoList;
