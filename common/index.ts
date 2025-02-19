export interface AppState {
  tasks: Array<{
    id: string;
    name: string;
    completed: boolean;
    time: string | null;
  }>;
  timerState: {
    startedAt: number | null;
    totalElapsed: number;
    isRunning: boolean;
    resetConfirmPending: boolean;
  };
}

export const exampleAppState: AppState = {
  tasks: [
    {
      id: "task_1",
      name: "Task 1",
      completed: true,
      time: "00:10",
    },
    {
      id: "task_2",
      name: "Task 2",
      completed: false,
      time: null,
    },
  ],
  timerState: {
    startedAt: null,
    totalElapsed: 0,
    isRunning: false,
    resetConfirmPending: false,
  },
};
