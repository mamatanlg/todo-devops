"use client";

import { useEffect, useState } from "react";

type Task = {
  text: string;
  completed: boolean;
};

const STORAGE_KEY = "todo-devops-tasks";

export default function Home() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);

    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch {
        setTasks([]);
      }
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, isLoaded]);

  const addTask = () => {
    const trimmedTask = task.trim();
    if (!trimmedTask) return;

    setTasks((currentTasks) => [
      ...currentTasks,
      {
        text: trimmedTask,
        completed: false,
      },
    ]);

    setTask("");
  };

  const toggleTask = (index: number) => {
    setTasks((currentTasks) =>
      currentTasks.map((item, i) =>
        i === index ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteTask = (index: number) => {
    setTasks((currentTasks) => currentTasks.filter((_, i) => i !== index));
  };

  const clearCompletedTasks = () => {
    setTasks((currentTasks) => currentTasks.filter((item) => !item.completed));
    setEditingIndex(null);
    setEditingText("");
  };

  const startEditing = (index: number, text: string) => {
    setEditingIndex(index);
    setEditingText(text);
  };

  const saveEdit = (index: number) => {
    const trimmedText = editingText.trim();
    if (!trimmedText) return;

    setTasks((currentTasks) =>
      currentTasks.map((item, i) =>
        i === index ? { ...item, text: trimmedText } : item
      )
    );

    setEditingIndex(null);
    setEditingText("");
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingText("");
  };

  const remainingTasks = tasks.filter((taskItem) => !taskItem.completed).length;

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow">
        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          TODO APPLICATION
        </h1>

        <p className="mb-6 text-sm text-gray-500">
          {remainingTasks} task{remainingTasks === 1 ? "" : "s"} remaining
        </p>

        <div className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Enter a task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="flex-1 rounded border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") addTask();
            }}
          />

          <button
            onClick={addTask}
            className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            Add Task
          </button>
        </div>

        <div className="mb-4 flex justify-end">
          <button
            onClick={clearCompletedTasks}
            disabled={tasks.every((item) => !item.completed)}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear completed
          </button>
        </div>

        <div>
          {tasks.length === 0 ? (
            <div className="rounded border border-dashed border-gray-300 p-6 text-center text-gray-500">
              No tasks yet. Add one to get started.
            </div>
          ) : (
            tasks.map((item, index) => (
              <div
                key={`${item.text}-${index}`}
                className="mb-2 flex items-center justify-between gap-3 rounded border p-3"
              >
                {editingIndex === index ? (
                  <div className="flex flex-1 items-center gap-2">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="flex-1 rounded border border-gray-300 px-3 py-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(index);
                        if (e.key === "Escape") cancelEdit();
                      }}
                      autoFocus
                    />

                    <button
                      onClick={() => saveEdit(index)}
                      className="rounded bg-green-600 px-3 py-2 text-white"
                    >
                      Save
                    </button>

                    <button
                      onClick={cancelEdit}
                      className="rounded border border-gray-300 px-3 py-2 text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <label className="flex flex-1 items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleTask(index)}
                      />

                      <span
                        className={
                          item.completed
                            ? "text-gray-400 line-through"
                            : "text-gray-800"
                        }
                      >
                        {item.text}
                      </span>
                    </label>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => startEditing(index, item.text)}
                        className="text-blue-600 transition hover:text-blue-800"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteTask(index)}
                        className="text-red-600 transition hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}