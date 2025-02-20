export interface AppState {
  tasks: { id: string; name: string | null }[];
}

export const exampleAppState: AppState = {
  tasks: [
    { id: "task_1", name: null },
    { id: "task_2", name: "Task 2" },
  ],
};
