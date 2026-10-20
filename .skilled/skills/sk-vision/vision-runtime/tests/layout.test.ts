// ───────────────────────────────────────────────────────────────────
// MODULE: Test Layout Guard
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from "bun:test";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const srcDir = join(import.meta.dir, "..", "src");

describe("test layout", () => {
  it("keeps no test file under src/", () => {
    // Tests under src/ sit beside the sources the build bundles, so they belong in tests/.
    const misplaced = readdirSync(srcDir, { recursive: true })
      .map((entry) => String(entry))
      .filter((entry) => entry.endsWith(".test.ts"));

    expect(misplaced).toEqual([]);
  });
});
