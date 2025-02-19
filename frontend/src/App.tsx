import {
  CheckCircle2,
  Circle,
  Pause,
  Play,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AppState } from "common";

// Add debounce utility
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default function App() {
  const [data, setData] = useState<AppState>({
    tasks: [],
    timerState: {
      startedAt: null,
      totalElapsed: 0,
      isRunning: false,
      resetConfirmPending: false,
    },
  });
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const editVersionRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [newTaskText, setNewTaskText] = useState("");
  const [displayTime, setDisplayTime] = useState(0);

  const { timerState } = data;

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:3000/ws");
    socketRef.current.onopen = () => {
      console.log("Connected to server");
    };
    socketRef.current.onclose = () => {
      console.log("Disconnected from server");
    };
    socketRef.current.onerror = (error) => {
      console.error("Error:", error);
    };
    socketRef.current.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      if (type === "update") {
        setData(data);
      }
    };
  }, []);

  // Find the first incomplete task
  const { tasks } = data;
  const currentTaskIndex = tasks.findIndex((task) => !task.completed);

  const debouncedUpdateData = debounce((newData: any, version: number) => {
    // Only send update if this is still the latest version
    if (version === editVersionRef.current) {
      updateDataAndSync(newData);
    }
  }, 200);

  // Add shared update function
  function updateDataAndSync(newData: typeof data) {
    // const validation = validateEquals<AppState>(newData);
    // if (!validation.success) {
    //   console.error(
    //     "Invalid app state:",
    //     newData,
    //     "Validation error:",
    //     validation.errors
    //   );
    //   return;
    // }
    setData(newData);
    socketRef.current?.send(
      JSON.stringify({
        type: "update",
        data: newData,
      })
    );
  }

  // Update handleTaskNameEdit to use debouncedUpdateData directly
  function handleTaskNameEdit(taskId: string, newName: string) {
    const currentVersion = ++editVersionRef.current;
    const updatedData = {
      ...data,
      tasks: tasks.map((t) => (t.id === taskId ? { ...t, name: newName } : t)),
    };

    setData(updatedData);
    debouncedUpdateData(updatedData, currentVersion);
  }

  // Update handleDeleteTask
  function handleDeleteTask(taskId: string) {
    const updatedData = {
      ...data,
      tasks: tasks.filter((t) => t.id !== taskId),
    };
    updateDataAndSync(updatedData);
  }

  // Update startTimer
  function startTimer() {
    const updatedData = {
      ...data,
      timerState: {
        ...timerState,
        startedAt: Date.now(),
        isRunning: true,
      },
    };
    updateDataAndSync(updatedData);
  }

  // Update pauseTimer
  function pauseTimer() {
    const updatedData = {
      ...data,
      timerState: {
        ...timerState,
        startedAt: null,
        totalElapsed: displayTime,
        isRunning: false,
      },
    };
    updateDataAndSync(updatedData);
  }
  // Update resetTimer
  function resetTimer() {
    if (timerState.resetConfirmPending) {
      console.log("resetting timer", { timeout: timeoutRef.current });
      const updatedData = {
        ...data,
        timerState: {
          startedAt: null,
          totalElapsed: 0,
          isRunning: false,
          resetConfirmPending: false,
        },
      };
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      updateDataAndSync(updatedData);
    } else {
      const updatedData = {
        ...data,
        timerState: {
          ...timerState,
          resetConfirmPending: true,
        },
      };
      updateDataAndSync(updatedData);

      // Clear reset confirmation after 2 seconds
      timeoutRef.current = setTimeout(() => {
        const clearedData = {
          ...data,
          timerState: {
            ...timerState,
            resetConfirmPending: false,
          },
        };
        updateDataAndSync(clearedData);
        timeoutRef.current = null;
      }, 2000);
    }
  }

  function formatTime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours.toString().padStart(2, "0")}:${(minutes % 60)
      .toString()
      .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
  }

  // Animation frame update for smooth timer
  useEffect(() => {
    function updateTimer() {
      if (timerState.isRunning) {
        setDisplayTime(
          timerState.totalElapsed + (Date.now() - (timerState.startedAt || 0))
        );
        animationFrameRef.current = requestAnimationFrame(updateTimer);
      }
    }

    if (timerState.isRunning) {
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    } else {
      setDisplayTime(timerState.totalElapsed);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [timerState.isRunning, timerState.startedAt, timerState.totalElapsed]);

  // Update handleTaskComplete
  function handleTaskComplete(taskId: string) {
    const updatedData = {
      ...data,
      tasks: tasks.map((t) =>
        t.id === taskId
          ? { ...t, completed: true, time: formatTime(displayTime) }
          : t
      ),
    };
    updateDataAndSync(updatedData);
  }

  // Update handleCreateTask
  function handleCreateTask(text: string) {
    if (!text.trim()) return;

    const newTask = {
      id: crypto.randomUUID(),
      name: text.trim(),
      completed: false,
      time: null,
    };

    const updatedData = {
      ...data,
      tasks: [...tasks, newTask],
    };
    updateDataAndSync(updatedData);
    setNewTaskText("");
  }

  return (
    <div className="h-screen w-screen p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!timerState.isRunning ? (
              <button
                onClick={startTimer}
                className="p-2 rounded bg-green-700 hover:bg-green-600 text-white"
              >
                <Play className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="p-2 rounded bg-yellow-700 hover:bg-yellow-600 text-white"
              >
                <Pause className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={resetTimer}
              className={`p-2 rounded text-white ${
                timerState.resetConfirmPending
                  ? "bg-red-700 hover:bg-red-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
          <div className="text-2xl font-mono px-4 py-2 rounded-lg bg-white">
            {formatTime(displayTime)}
          </div>
        </div>

        <div className="space-y-1">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className={`
                group flex items-center justify-between px-3 py-2 rounded
                ${
                  task.completed
                    ? "bg-green-900 text-white hover:bg-green-800"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }
                ${
                  index === currentTaskIndex
                    ? "bg-green-500 hover:bg-green-800border border-green-700"
                    : ""
                }
              `}
            >
              <div className="flex items-center gap-3">
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle
                    className="w-5 h-5 text-gray-500 cursor-pointer hover:text-green-500"
                    onClick={() => handleTaskComplete(task.id)}
                  />
                )}
                {editingTaskId === task.id ? (
                  <input
                    type="text"
                    value={task.name}
                    onChange={(e) =>
                      handleTaskNameEdit(task.id, e.target.value)
                    }
                    onBlur={() => setEditingTaskId(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setEditingTaskId(null);
                      }
                    }}
                    className="bg-transparent outline-none focus:border-b border-gray-500"
                    autoFocus
                  />
                ) : (
                  <span
                    onClick={() => setEditingTaskId(task.id)}
                    className="cursor-text"
                  >
                    {task.name}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={task.completed ? "text-gray-500" : "text-gray-300"}
                >
                  {task.completed
                    ? task.time
                    : index === currentTaskIndex
                    ? formatTime(displayTime)
                    : "–:–:–"}
                </span>
                <Trash2
                  className="w-4 h-4 text-gray-500 hover:text-red-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTask(task.id);
                  }}
                />
              </div>
            </div>
          ))}

          {/* Ghost task for creating new tasks */}
          <div
            className={`
              group flex items-center justify-between px-3 py-2 rounded
              bg-gray-900/20 text-gray-400 hover:bg-gray-800/30
              ${newTaskText ? "border border-gray-700" : ""}
            `}
          >
            <div className="flex items-center gap-3">
              <Circle className="w-5 h-5 text-gray-500/50" />
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onBlur={() => {
                  handleCreateTask(newTaskText);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateTask(newTaskText);
                    setNewTaskText("");
                  } else if (e.key === "Escape") {
                    setNewTaskText("");
                  }
                }}
                placeholder="Add a new task..."
                className="bg-transparent outline-none focus:border-b border-gray-500 placeholder-gray-600 w-full text-gray-400 focus:text-gray-600 transition-colors"
              />
            </div>
            <span className="text-gray-500">–:–:–</span>
          </div>
        </div>
      </div>
    </div>
  );
}
