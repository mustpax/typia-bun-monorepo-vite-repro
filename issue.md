# Typia validation inconsistency between frontend and backend in Bun monorepo

Thanks for taking the time to fill out this bug report! If you have a usage question or are unsure if this is really a bug, please use:

- Read the [docs](https://typia.io), or using the package
- Search/check issues and discussions in this repository

## What platform is your computer? Copy the output of `uname -a` or `systeminfo`

System: OS: macOS 14.2.2 CPU: (8) arm64 Apple M2 Memory: 32/32 GB

## Describe the bug

When using typia's `validateEquals` function to validate the same data against the same type definition in a monorepo setup, I'm getting inconsistent validation results between frontend and backend.

## Project Structure

The project is structured as a monorepo with three packages:

1. `common` - A shared package containing:

   - TypeScript interfaces and types used across the application
   - Shared constants and utility functions
   - Example/test data structures
   - This package is imported by both frontend and backend

2. `frontend` - The client-side React application that:

   - Imports and uses types/interfaces from `common`
   - Validates data structures using typia
   - Renders the UI components

3. `backend` - The server-side application that:
   - Also imports and uses types/interfaces from `common`
   - Performs the same validation as frontend using typia
   - Handles API requests and business logic

This setup allows us to:

- Share code between frontend and backend
- Maintain type safety across the entire application
- Have a single source of truth for data structures
- Avoid code duplication

The issue arises when the same validation logic produces different results in frontend vs backend, despite using identical types from the shared `common` package.

Here's the relevant code structure:

```ts
// common/src/index.ts
export interface AppState {
  tasks: { id: string; name: string | null }[];
}

export const exampleAppState: AppState = {
  tasks: [
    { id: "task_1", name: null },
    { id: "task_2", name: "Task 2" },
  ],
};
```

```ts
// backend/src/index.ts
import { validateEquals } from "typia";
import { exampleAppState } from "common";

console.log("Backend validation result:", validateEquals(exampleAppState));
```

```ts
// frontend/src/App.tsx
import { validateEquals } from "typia";
import { exampleAppState } from "common";

console.log("Frontend validation result:", validateEquals(exampleAppState));
```

### Steps to Reproduce

1. **Clone the Repository**
   Clone the repository that contains the monorepo setup:

   ```sh
   git clone https://github.com/mustpax/typia-bun-monorepo-vite-repro
   cd typia-bun-monorepo-vite-repro
   ```

2. **Validate Data in Backend**
   Navigate to the `backend` directory and run the backend validation:

   ```sh
   cd backend
   bun run src/index.ts
   ```

   - The console should log: `Backend validation result: { success: true, ... }`

3. **Validate Data in Frontend**
   Navigate to the `frontend` directory and start the frontend application:

   ```sh
   cd ../frontend
   bun dev
   ```

   - The browser window should display: `Frontend validation result: { success: false, ... }`

### Expected Behavior

The validation result should be consistent between the frontend and backend, both returning `success: true`.

### Actual Behavior

The backend validation returns `success: true`, while the frontend validation returns `success: false`.

### Additional Context

- Ensure that both frontend and backend are using the same version of `typia`.
- Check for any differences in the environment or configuration that might affect the validation process.
