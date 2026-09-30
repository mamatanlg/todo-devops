"use client";

import { useState } from "react";

type Task = {
  text: string;
  completed: boolean;
};

export default function Home() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = () => {
    if (task.trim() === "") return;

    setTasks([
      ...tasks,
      {
        text: task,
        completed: false,
      },
    ]);

    setTask("");
  };

  const toggleTask = (index: number) => {
    setTasks(
      tasks.map((item, i) =>
        i === index
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">
          TODO APPLICATION
        </h1>

        <div className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Enter a task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="flex-1 rounded border border-gray-300 px-4 py-2"
          />

          <button
            onClick={addTask}
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Add Task
          </button>
        </div>

        <div>
          {tasks.map((item, index) => (
            <div
              key={index}
              className="mb-2 flex items-center justify-between rounded border p-3"
            >
              <label className="flex items-center gap-2">
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

              <button className="text-red-600">
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}