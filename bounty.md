# Problem Description

Fix this [GitHub issue](https://github.com/ryoppippi/unplugin-typia/issues/393) on the [unplugin-typia](https://github.com/ryoppippi/unplugin-typia) repo. There is an inconsistency in typia validation results between frontend and backend code in a Bun monorepo setup, where the same validation returns success:true in backend but success:false in frontend. The issue needs to be fixed by modifying configuration or the typia packages, without changing the application code in the common, frontend or backend packages.

Typia is a TypeScript runtime type validator and transformer similar to Zod that generates runtime validation code from TypeScript type definitions to ensure type safety at runtime.

# Acceptance Criteria

An acceptable solution will:

- Output of all Typia validation functions must be the same in both frontend and backend.
- Will not modify `common/index.ts`
- Will not modify `backend/index.ts`
- Will not modify `frontend/App.tsx`
- May modify the following files to fix the issue:
  - Project configuration files for Typescript, Vite or Bun
  - [`unplugin-typia`](https://github.com/ryoppippi/unplugin-typia)
  - [`typia`](https://github.com/samchon/typia)

# Technical Details

The issue occurs in a Bun monorepo setup where typia validation behaves inconsistently between frontend and backend code. The project structure consists of:

1. `common` package:

   - Contains shared TypeScript interfaces and types
   - Example data structures used across the app
   - Imported by both frontend and backend

2. `frontend` package:

   - React application using types from common
   - Uses typia for validation
   - Shows validation failing (`success: false`)

3. `backend` package:
   - Server application using same types from common
   - Uses typia for validation
   - Shows validation passing (`success: true`)

The validation inconsistency occurs when using typia's `validateEquals` function on the same data structure and type definition from the shared common package. The backend validation returns `success: true` while the frontend validation returns `success: false`, despite using:

- Identical type definitions from common
- Same version of typia
- Same example data structure
- Same validation function

The issue needs to be fixed by modifying configuration files or the typia/unplugin-typia packages, without changing the application code in common, frontend or backend packages.

# Link to Project

https://github.com/mustpax/typia-bun-monorepo-vite-repro

# Steps to Reproduce

1. Clone the repository:

   ```bash
   git clone https://github.com/mustpax/typia-bun-monorepo-vite-repro
   cd typia-bun-monorepo-vite-repro
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Start the development server:

   ```bash
   bun dev
   ```

4. Observe the validation results:

   - In the browser (frontend):

     - Open http://localhost:5173
     - Check browser console
     - Note validation shows `success: false`

   - In terminal (backend):
     - Check terminal output
     - Note validation shows `success: true`

5. Verify validation inconsistency:

   - Both frontend and backend use identical:
     - Type definitions from common/index.ts
     - Example data from common/index.ts
     - Typia validateEquals function
     - Yet produce different validation results

6. Key files to examine:
   - common/index.ts - Shared types and example data
   - frontend/src/App.tsx - Frontend validation
   - backend/index.ts - Backend validation
   - Project config files (tsconfig.json, vite.config.ts)
