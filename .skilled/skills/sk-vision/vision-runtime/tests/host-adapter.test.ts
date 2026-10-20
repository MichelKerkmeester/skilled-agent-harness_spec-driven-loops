// ───────────────────────────────────────────────────────────────────
// MODULE: OpenCode Host Adapter Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from "bun:test";
import { chmodSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
// Extensionless so the bundler-resolution typecheck accepts a hook outside src/;
// Bun resolves the same sk-vision.ts source.
import { SkVisionPlugin } from "../../hooks/opencode/sk-vision";
import { skVisionTools } from "../src/opencode/tools.js";

describe("OpenCode host adapter", () => {
  it("registers the event, chat.message, tool and dispose hooks", async () => {
    const dir = mkdtempSync(join(tmpdir(), "sk-vision-host-"));
    const stub = join(dir, "python");
    writeFileSync(
      stub,
      `#!/bin/sh
while read -r line; do
  id=$(printf '%s' "$line" | sed -E 's/.*"id":(-?[0-9]+).*/\\1/')
  [ "$id" = "-1" ] && exit 0
  printf '{"id":%s,"result":{}}\\n' "$id"
done
`,
    );
    chmodSync(stub, 0o755);

    const saved = {
      python: process.env.SK_VISION_PYTHON,
    };
    process.env.SK_VISION_PYTHON = stub;

    try {
      const hooks = await SkVisionPlugin(
        { client: { tui: { showToast: async () => ({}) } }, directory: dir } as never,
        {} as never,
      );

      expect(typeof hooks.event).toBe("function");
      expect(typeof hooks["chat.message"]).toBe("function");
      expect(typeof hooks.dispose).toBe("function");

      const registered = Object.keys(hooks.tool ?? {}).sort();
      expect(registered).toEqual(Object.keys(skVisionTools(() => ({}) as never)).sort());
      expect(registered).toHaveLength(13);

      await hooks.dispose?.();
    } finally {
      if (saved.python === undefined) delete process.env.SK_VISION_PYTHON;
      else process.env.SK_VISION_PYTHON = saved.python;
    }
  });

  it("returns only dispose when disabled", async () => {
    const hooks = await SkVisionPlugin(
      { client: {}, directory: "x" } as never,
      { enabled: false } as never,
    );

    expect(Object.keys(hooks)).toEqual(["dispose"]);
  });
});
