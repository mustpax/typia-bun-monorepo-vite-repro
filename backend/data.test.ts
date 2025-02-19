import { test, expect } from "bun:test";
import { validateEquals } from "typia";
import type { AppState } from "common";

test("data-init.json should contain valid AppState data", async () => {
  // Read and parse data-init.json
  const data = JSON.parse(await Bun.file("data-init.json").text());

  // Validate the data against AppState type
  const validation = validateEquals<AppState>(data);

  expect(validation.success).toBe(true);
});
