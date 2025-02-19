import { exampleAppState, AppState } from "common";
import { validateEquals } from "typia";

export default function App() {
  return (
    <div>
      <pre>
        <code>
          {JSON.stringify(validateEquals<AppState>(exampleAppState), null, 2)}
        </code>
      </pre>
    </div>
  );
}
