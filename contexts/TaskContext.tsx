import React, { createContext, useState, useEffect } from "react";

// Import types for the Task context for typing consistency
import { Task } from "../types/types";

/**
 * Interface for the TaskContext value.
 * Contains the tasks state and functions to manage tasks.
 */
interface TaskContextValue {
  tasks: Task[]; // Centralized state for tasks to share with the entire app
  addTask: (text: string, color: string, dueDate: Date) => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
  reorderTasks: (data: Task[]) => void;
  editTask: (
    id: number,
    newText: string,
    newColor: string,
    newDueDate: Date,
  ) => void;
}

/**
 * Create a context for managing tasks, with default values.
 */
export const TaskContext = createContext<TaskContextValue>({
  tasks: [],
  addTask: () => {},
  toggleTask: () => {},
  deleteTask: () => {},
  reorderTasks: () => {},
  editTask: () => {},
});

/**
 * Reorders tasks based on their completion status.
 * Completed tasks are ALWAYS moved to the end of the list.
 *
 * @param list - The array of tasks to reorder.
 * @returns A new array of tasks sorted by completion status.
 */
function reorderTasksAlg(list: Task[]) {
  return [...list].sort((a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
  );
}

/**
 * TaskProvider component provides the TaskContext to its children
 * and manages the state of tasks, including adding, toggling, deleting,
 * editing, and reordering tasks.
 */
export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Example tasks - inserted when the app is first loaded
  useEffect(() => {
    const initial: Task[] = [
      {
        id: 1,
        text: "Implement advanced feature",
        color: "#ffffff",
        dueDate: new Date("2025-03-19"),
        completed: false,
      },
      {
        id: 2,
        text: "Fix critical bug #42",
        color: "#ffe4b5",
        dueDate: new Date("2025-04-12"),
        completed: false,
      },
      {
        id: 3,
        text: "Prepare for the upcoming presentation",
        color: "#ffcccb",
        dueDate: new Date("2025-04-11"),
        completed: false,
      },
      {
        id: 4,
        text: "Conduct code review for PR #123",
        color: "#b0e0e6",
        dueDate: new Date("2025-04-10"),
        completed: false,
      },
      {
        id: 5,
        text: "Update documentation for the new API",
        color: "#90ee90",
        dueDate: new Date("2025-05-09"),
        completed: false,
      },
      {
        id: 6,
        text: "Plan the next sprint",
        color: "#cccccc",
        dueDate: new Date("2025-05-15"),
        completed: false,
      },
    ];
    setTasks(reorderTasksAlg(initial));
  }, []);

  /**
   * Adds a new task to the tasks state.
   */
  const addTask = (text: string, color: string, dueDate: Date) => {
    const newTask: Task = {
      id: Date.now(),
      text,
      color,
      dueDate,
      completed: false,
    };
    setTasks((prev) => reorderTasksAlg([newTask, ...prev]));
  };

  /**
   * Toggles the completion status of a task by its ID.
   */
  const toggleTask = (id: number) => {
    setTasks((prev) => {
      const next = prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t,
      );
      return reorderTasksAlg(next);
    });
  };

  /**
   * Deletes a task by its ID.
   */
  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  /**
   * Reorders the tasks based on their completion status.
   */
  const reorderTasks = (data: Task[]) => {
    setTasks(reorderTasksAlg(data));
  };

  /**
   * Edits an existing task, updating its text, color, and due date.
   */
  const editTask = (
    id: number,
    newText: string,
    newColor: string,
    newDueDate: Date,
  ) => {
    setTasks((prev) => {
      const next = prev.map((t) =>
        t.id === id
          ? { ...t, text: newText, color: newColor, dueDate: newDueDate }
          : t,
      );
      return reorderTasksAlg(next);
    });
  };

  // Provide the TaskContext value to its children
  return (
    <TaskContext.Provider
      value={{ tasks, addTask, toggleTask, deleteTask, reorderTasks, editTask }}
    >
      {children}
    </TaskContext.Provider>
  );
}
