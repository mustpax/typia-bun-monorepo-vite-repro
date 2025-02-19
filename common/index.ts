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
