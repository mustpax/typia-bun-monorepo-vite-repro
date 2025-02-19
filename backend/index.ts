import type { AppState } from "common";
import { validateEquals } from "typia";
import { exampleAppState } from "common";

console.log(validateEquals<AppState>(exampleAppState));
